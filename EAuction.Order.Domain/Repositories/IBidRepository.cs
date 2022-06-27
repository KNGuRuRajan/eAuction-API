
using System.Collections.Generic;
using System.Threading.Tasks;
using EAuction.Order.Domain.Entities;
using EAuction.Order.Domain.Repositories.Base;
namespace EAuction.Order.Domain.Repositories
{
    public interface IBidRepository
    {
        Task<IEnumerable<Entities.Bid>> GetBidsByBuyerEmailId(string emailId);
        Task<Bid> SendBid(Bid bid);
        Task<IEnumerable<Bid>> GetBids(string productId);
        Task<bool> UpdateBidAmount(string productId, string buyerEmailId, decimal newBidAmount);
        Task<bool> UpdateBidStatus(string productId, string buyerEmailId, string bidStatus);
    }
}