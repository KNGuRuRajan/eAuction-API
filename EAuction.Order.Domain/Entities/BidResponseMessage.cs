namespace EAuction.Order.Domain.Entities
{
    public class BidResponseMessage
    {
        public string ErrorMessage { get; set; }

        public int StatusCode { get; set; }

        public bool isSucuess { get; set; }
    }
}
