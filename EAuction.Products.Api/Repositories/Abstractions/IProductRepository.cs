using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using EAuction.Products.Api.Entities;

namespace EAuction.Products.Api.Repositories.Abstractions
{
    public interface IProductRepository
    {
        Task<ProductResponse> GetProducts(SearchParam searchParam);
        Task<ProductResponse> GetProductsUploadedBy(SearchParam searchParam);
        Task<Product> GetProduct(string id);
        Task Create(Product product);
        Task<bool> Update(Product product);
        Task<ProductResponse> Delete(string id);
    }
}