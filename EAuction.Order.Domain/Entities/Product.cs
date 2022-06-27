using EAuction.Order.Domain.Entities.Base;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAuction.Order.Domain.Entities
{
    public class Product : Entity
    {
        public string ProductName { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public int Category { get; set; }
        public decimal StartingPrice { get; set; }
        public DateTime BidEndDate { get; set; }
        public string FirstName { get; set; }        
        public string LastName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Pin { get; set; }       
        public long Phone { get; set; }      
        public string Email { get; set; }
    }
}