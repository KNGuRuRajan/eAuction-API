using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace EAuction.APIGateway.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
       
        public string FirstName { get; set; }
       
        public string LastName { get; set; }
       
        public string Password { get; set; }
       
        public string Email { get; set; }

        public int RoleId { get; set; }

        public string Token{ get; set; }
    }
}
