
using System.Collections.Generic;

namespace EAuction.Products.Api.Entities
{
    public class ProductResponse
    {
        public string ErrorMessage { get; set; }

        public int StatusCode { get; set; }

        public bool IsSucuess{ get; set; }

        public List<Product> Products { get; set; }

        public int Page{ get; set; }

        public long Total { get; set; }

        public long LastPage { get; set; }
    }
}
