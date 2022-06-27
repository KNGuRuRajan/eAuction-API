
namespace EAuction.Products.Api.Entities
{
    public class SearchParam
    {
        public string SearchText { get; set; }

        public string SortOrder { get; set; }

        public string EmailId { get; set; }

        public int Page { get; set; }

        public int PerPage { get; set; }
    }
}
