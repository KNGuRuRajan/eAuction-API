using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EAuction.Products.Api.Data.Abstractions;
using EAuction.Products.Api.Entities;
using EAuction.Products.Api.Repositories.Abstractions;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace EAuction.Products.Api.Repositories
{
    public class ProductRepository:IProductRepository
    {
        private readonly IProductContext _context;

        public ProductRepository(IProductContext context)
        {
            _context = context;
        }

        public async Task<ProductResponse> GetProducts(SearchParam searchParam)
        {
            List<Product> products = new List<Product>();
            ProductResponse response = new ProductResponse();
            long total = 0;

            searchParam.Page = searchParam.Page == 0 ? 1 : searchParam.Page; ;
            if (string.IsNullOrEmpty(searchParam.SearchText))
            {
                total = await _context.Products.Find(p => true).CountDocumentsAsync();                
                products = await _context.Products.Find(p => true).Skip((searchParam.Page - 1) * searchParam.PerPage).Limit(searchParam.PerPage).ToListAsync();
            }
            else
            {
                total = await _context.Products.Find(p => true && p.ProductName.Contains(searchParam.SearchText)).CountDocumentsAsync();
                products = await _context.Products.Find(p => true && p.ProductName.ToLower().Contains(searchParam.SearchText.ToLower())).Skip((searchParam.Page - 1) * searchParam.PerPage).Limit(searchParam.PerPage).ToListAsync();
            }

            var sorteredList = searchParam.SortOrder == "lowest" ? products.OrderBy(o => o.StartingPrice).ToList() : products.OrderByDescending(o => o.StartingPrice).ToList();
            return new ProductResponse() { Page = searchParam.Page, Total = total, IsSucuess = true, ErrorMessage = string.Empty, Products = sorteredList, LastPage = (total / searchParam.PerPage) + 1 };
        }

        public async Task<ProductResponse> GetProductsUploadedBy(SearchParam searchParam)
        {  
            List<Product> products = new List<Product>();
            ProductResponse response = new ProductResponse();
            long total = 0;
            searchParam.Page = searchParam.Page == 0 ? 1 : searchParam.Page;
            if (string.IsNullOrEmpty(searchParam.SearchText))
            {
                total = await _context.Products.Find(p => p.Email == searchParam.EmailId).CountDocumentsAsync();
                products = await _context.Products.Find(p => p.Email == searchParam.EmailId).Skip((searchParam.Page - 1) * searchParam.PerPage).Limit(searchParam.PerPage).ToListAsync();
            }
            else
            {
                total = await _context.Products.Find(p => p.Email == searchParam.EmailId && p.ProductName.ToLower().Contains(searchParam.SearchText.ToLower())).CountDocumentsAsync();
                products = await _context.Products.Find(p => p.Email == searchParam.EmailId && p.ProductName.ToLower().Contains(searchParam.SearchText.ToLower())).Skip((searchParam.Page -1) * searchParam.PerPage).Limit(searchParam.PerPage).ToListAsync();
            }

            var sorteredList = searchParam.SortOrder == "lowest" ? products.OrderBy(o => o.StartingPrice).ToList() : products.OrderByDescending(o => o.StartingPrice).ToList();

            return new ProductResponse() { Page = searchParam.Page, Total = total, IsSucuess= true, ErrorMessage = string.Empty, Products = sorteredList, LastPage = (total / searchParam.PerPage) + 1 };
        }

        public async Task<Product> GetProduct(string id)
        {
            var result = await _context.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
            return result;
        }      

        public async Task Create(Product product)
        {
            await _context.Products.InsertOneAsync(product);
        }

        public async Task<bool> Update(Product product)
        {
            var result = false;
            var productExist = await _context.Products.Find(p => p.Id == product.Id).FirstOrDefaultAsync();

            if (productExist != null)
            {               
                var updatedResult = await _context.Products.ReplaceOneAsync(filter: g => g.Id == product.Id, replacement: product);
                result = updatedResult.IsAcknowledged && updatedResult.ModifiedCount > 0;
            }

            return result;
        }

        public async Task<ProductResponse> Delete(string id)
        {
            var result = false;
            var placedBids = _context.Bids.CountDocuments(b => b.ProductId == id);

            if (placedBids == 0)
            {
                var product = await _context.Products.Find(p => p.Id == id).FirstOrDefaultAsync();

                if (product != null)
                {
                    if (product.BidEndDate < DateTime.Now)
                    {
                        return new ProductResponse() { StatusCode = 400, IsSucuess = false, ErrorMessage = "The selected product cannot be deleted because Bid End date is expired" };
                    }
                    else
                    {
                        var filter = Builders<Product>.Filter.Eq(m => m.Id, id);
                        DeleteResult deleteResult = await _context.Products.DeleteOneAsync(filter);
                        result = deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
                    }
                }
            }
            else
            {
                return new ProductResponse() { StatusCode = 400, IsSucuess = false, ErrorMessage = "The selected product has valid bids. It cannot be deleted!!" };
                
            }

            return new ProductResponse() { IsSucuess = result, ErrorMessage = string.Empty };
        }
    }
}