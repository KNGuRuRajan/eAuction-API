using EAuction.Order.Domain.Repositories;
using EAuction.Order.Infrastructure.Data;
using EAuction.Order.Infrastructure.Repositories;
using EAuction.Order.Infrastructure.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace EAuction.Order.Infrastructure.IOC
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddTransient<IBidDatabaseSettings, BidDatabaseSettings>();
            services.AddTransient<IBidContext, BidContext>();
            services.AddTransient<IBidRepository, BidRepository>();

            return services;
        }
    }
}