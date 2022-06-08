using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EAuction.Order.Domain.Entities;
using EAuction.Order.Domain.Repositories;
using EAuction.Order.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace EAuction.Order.Infrastructure.Repositories
{
    public class BidRepository : IBidRepository
    {
        private readonly IBidContext _context;

        public BidRepository(IBidContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Bid>> GetBidsByProductId(string productId)
        {
            var bidList = await _context.Bids.Find(o => o.ProductId == productId).ToListAsync();
            return bidList;
        }

        public async Task<Bid> SendBid(Bid bid)
        {
            var result = await _context.Bids.Find(p => p.ProductId == bid.ProductId && p.Email.ToLower() == bid.Email.ToLower()).FirstOrDefaultAsync();

            if (result == null)
            {
                await _context.Bids.InsertOneAsync(bid);
            }
            else
            {
                throw new Exception("More than one bid on a same product is not allowed..");
            }

            return bid;
        }

        public async Task<IEnumerable<Bid>> GetBids(string productId)
        {
            var result = await _context.Bids.Find(p => p.ProductId == productId).ToListAsync();
            return result;
        }

        public async Task<bool> UpdateBidAmount(string productId, string buyerEmailId, decimal newBidAmount)
        {
            var result = false;
            var foundBid = await _context.Bids.Find(p => p.ProductId == productId && p.Email == buyerEmailId).FirstOrDefaultAsync();

            if (foundBid != null)
            {
                foundBid.BidAmount = newBidAmount;
                var updatedResult = await _context.Bids.ReplaceOneAsync(filter: g => g.Id == foundBid.Id, replacement: foundBid);
                result = updatedResult.IsAcknowledged && updatedResult.ModifiedCount > 0;
            }

            return result;
        }
    }
}