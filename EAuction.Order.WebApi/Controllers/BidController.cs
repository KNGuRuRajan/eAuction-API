
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

        public BidController(IMediator mediator, ILogger<BidController> logger, IMapper mapper, EventBusRabbitMQProducer eventBus)
        {
            _mediator = mediator;
            _logger = logger;
            _mapper = mapper;
            _eventBus = eventBus;
        }
      
        [HttpGet("GetBids/{productId}")]
        [ProducesResponseType(typeof(IEnumerable<BidResponse>),(int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<ActionResult<IEnumerable<BidResponse>>> GetBidsByProductId(string productId)
        {
            var query = new GetBidsByProductIdQuery(productId);

            var bids = await _mediator.Send(query);
            if (bids.Count()== 0)
            {
                return NotFound();
            }

            return Ok(bids);
        }

        [HttpPost("PlaceBid")]
        [ProducesResponseType(typeof(Bid), (int)HttpStatusCode.Created)]
        public async Task<ActionResult<BidResponse>> BidCreate([FromBody] BidCreateCommand bidCreateCommand)
        {
            var result = await _mediator.Send(bidCreateCommand);
            BidCreateEvent eventMessage = _mapper.Map<BidCreateEvent>(bidCreateCommand);

            try
            {              
                _eventBus.Publish(EventBusConstants.BidCreateQueue, eventMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ERROR Publishing integration event: {EventId} from {AppName}", eventMessage.Id, "Bidding");
                throw;
            }           

            return Ok(result);
        }

        [HttpPut("UpdateBid/{productId}/{buyerEmailId}/{newBidAmount}")]
        [ProducesResponseType(typeof(Bid), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateBidAmount(string productId, string buyerEmailId, decimal newBidAmount)
        {
            var updateCommand = new BidUpdateCommand(productId, buyerEmailId, newBidAmount);

            return Ok(await _mediator.Send(updateCommand));         
        }
    }
}
