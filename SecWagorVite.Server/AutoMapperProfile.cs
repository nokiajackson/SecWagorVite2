using AutoMapper;
using SecWagorVite.Server.Helpers;
using SecWagorVite.Server.Controllers.Service;
using SecWagorVite.Server.Models;
using SecWagorVite.Server.Service;
using SecWagorVite.Server.Controllers;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Mapping from EntryLogVM to EntryLog
        CreateMap<EntryLogVM, EntryLog>()
            .ForMember(dest => dest.Purpose, opt => opt.MapFrom(src => (int)src.Purpose));

        // Mapping from EntryLog to EntryLogVM
        CreateMap<EntryLog, EntryLogVM>()
            .ForMember(dest => dest.Purpose, opt => opt.MapFrom(src => (Purpose)src.Purpose));

    }
}