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

        public async Task<IEnumerable<Bid>> GetBidsByBuyerEmailId(string emailId)
        {
            var bidList = await _context.Bids.Find(o => o.Email == emailId).ToListAsync();
            List<Bid> updatedBidList = new List<Bid>();
            foreach (var bid in bidList)
            {
                bid.ProductId = _context.Products.Find(o => o.Id == bid.ProductId).FirstOrDefault().ProductName.ToString();
                updatedBidList.Add(bid);
            }

            return updatedBidList;
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
                return null;
            }

            return bid;
        }

        public async Task<IEnumerable<Bid>> GetBids(string productId)
        {
            var result = await _context.Bids.Find(p => p.ProductId == productId).SortBy(e => e.BidAmount).ToListAsync();
            var sorteredList = result.OrderBy(o => o.BidAmount).ToList();
            return sorteredList;
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


        public async Task<bool> UpdateBidStatus(string productId, string buyerEmailId, string bidStatus)
        {  
            var result = false;
            var foundBid = await _context.Bids.Find(p => p.ProductId == productId && p.Email == buyerEmailId).FirstOrDefaultAsync();           

            if (foundBid != null)
            {
                foundBid.Comment = bidStatus;
                foundBid.BidStatus = bidStatus;
                var updatedResult = await _context.Bids.ReplaceOneAsync(filter: g => g.Id == foundBid.Id, replacement: foundBid);
                result = updatedResult.IsAcknowledged && updatedResult.ModifiedCount > 0;
            }

            if (bidStatus.ToLower() == "accepted")
            {
                List<Bid> rejectedBids = await _context.Bids.Find(p => p.ProductId == productId && p.Email != buyerEmailId).ToListAsync();

                if (rejectedBids != null && rejectedBids.Count > 0)
                {
                    foreach (var rejectedBid in rejectedBids)
                    {
                        rejectedBid.Comment = "Rejected";
                        rejectedBid.BidStatus = "Rejected";
                        var updatedResult = await _context.Bids.ReplaceOneAsync(filter: g => g.Id == rejectedBid.Id, replacement: rejectedBid);                     
                    }
                }
            }


            return result;
        }
    }
}