
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using EAuction.Order.Application.Commands;
using EAuction.Order.Application.Commands.OrderCreate;
using EAuction.Order.Application.Queries;
using EAuction.Order.Application.Responses;
using EAuction.Order.Domain.Entities;
using EAuction.Order.Domain.Repositories;
using EventBusRabbitMQ.Core;
using EventBusRabbitMQ.Events;
using EventBusRabbitMQ.Producer;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EAuction.Order.WebApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class BidController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<BidController> _logger;
        private readonly IMapper _mapper;
        private readonly EventBusRabbitMQProducer _eventBus;
        private readonly IBidRepository _bidRepository;

        public BidController(IMediator mediator, ILogger<BidController> logger, IMapper mapper, EventBusRabbitMQProducer eventBus, IBidRepository bidRepository)
        {
            _mediator = mediator;
            _logger = logger;
            _mapper = mapper;
            _eventBus = eventBus;
            _bidRepository = bidRepository;
        }
      
        [HttpGet("GetBidsByProductId/{productId}")]
        [ProducesResponseType(typeof(IEnumerable<BidResponse>),(int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<IEnumerable<BidResponse>>> GetBidsByProductId(string productId)
        {
            var query = new GetBidsByProductIdQuery(productId);

            var bids = await _mediator.Send(query);         

            return Ok(bids);
        }

        [HttpGet("GetBidHistory/{emailId}")]
        [ProducesResponseType(typeof(IEnumerable<BidResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<IEnumerable<BidResponse>>> GetBidsByBuyerEmail(string emailId)
        {
            var result = await this._bidRepository.GetBidsByBuyerEmailId(emailId); 
            return Ok(result);
        }

        [HttpPost("PlaceBid")]
        [ProducesResponseType(typeof(Bid), (int)HttpStatusCode.Created)]
        public async Task<ActionResult<BidResponse>> CreateBid([FromBody] BidCreateCommand bidCreateCommand)
        {
            var result = await _mediator.Send(bidCreateCommand);

            if (result == null)
            {
               return Ok(new BidResponseMessage() { StatusCode = 400, ErrorMessage = "More than one bid on a same product is not allowed..", isSucuess = false });
            }

            BidCreateEvent eventMessage = _mapper.Map<BidCreateEvent>(bidCreateCommand);

            //try
            //{              
            //    _eventBus.Publish(EventBusConstants.BidCreateQueue, eventMessage);
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError(ex, "ERROR Publishing integration event: {EventId} from {AppName}", eventMessage.Id, "Bidding");
            //    throw;
            //}           

            return Ok(result);
        }

        [HttpPut("UpdateBid/{productId}/{buyerEmailId}/{newBidAmount}")]
        [ProducesResponseType(typeof(Bid), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateBidAmount(string productId, string buyerEmailId, decimal newBidAmount)
        {
            var updateCommand = new BidUpdateCommand(productId, buyerEmailId, newBidAmount);

            return Ok(await _mediator.Send(updateCommand));         
        }

        [HttpPut("UpdateBidStatus/{productId}/{buyerEmailId}/{bidStatus}")]
        [ProducesResponseType(typeof(Bid), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateBidStatus(string productId, string buyerEmailId, string bidStatus)
        {
            var result = await this._bidRepository.UpdateBidStatus(productId, buyerEmailId, bidStatus);
            return Ok(result);
        }
    }
}
