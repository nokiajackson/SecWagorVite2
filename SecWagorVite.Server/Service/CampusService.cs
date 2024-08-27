using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SecWagorVite.Server.Controllers.Service;
using SecWagorVite.Server.Models;
using SecWagorVite.Server.Service;

public class CampusService : BaseService<Campus>
{
    private readonly IConfiguration _configuration;

    /// <param name="dbModel"></param>
    /// <param name="configuration"></param>
    public CampusService(SecDbContext dbModel,
        IConfiguration configuration
        ) : base(dbModel)
    {
        _configuration = configuration;
    }

}
