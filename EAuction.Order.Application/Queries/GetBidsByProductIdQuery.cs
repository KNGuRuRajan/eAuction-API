using System.Collections.Generic;
using EAuction.Order.Application.Responses;
using MediatR;

namespace EAuction.Order.Application.Queries
{
    public class GetBidsByProductIdQuery : IRequest<IEnumerable<BidResponse>>
    {
        public GetBidsByProductIdQuery(string productId)
        {
            ProductId = productId;
        }

        public string ProductId { get; set; }

    }
}