using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using Caretaskr.Data;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.FHIR.Data;
using CareTaskr.Service;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using CareTaskr.Service.Service;
using CareTaskr.Utility;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Caretaskr.Data.Seed;
using System.IO;
using System.Reflection;
using System.Text.Json.Serialization;
using DinkToPdf;
using DinkToPdf.Contracts;
using System;
using Microsoft.OpenApi.Models;
using CareTaskr.Filters;
using Caretaskr.Common.Validators;
using System.Text;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using CareTaskr.Domain.DataAuthorization;
using CareTaskr.Authorization;
using Caretaskr.Service.Service;
using Azure.Storage.Blobs;
using Newtonsoft.Json;

namespace CareTaskr
{
    public class Startup
    {
        IServiceCollection _services;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {


            _services = services;
            var careTasrkUrl = Configuration.GetSection("CareTaskrUrl").Get<CareTaskrUrl>();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });
            services.AddAutoMapper(typeof(AllergiesMapper));



            services.AddIdentity<User, Role>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
                opt.SignIn.RequireConfirmedEmail = true;
            })
                    .AddEntityFrameworkStores<ApplicationContext>()
                    .AddDefaultTokenProviders();
            services.AddTransient<PasswordHasher<User>>();

            services.AddMvc().AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });


            var connectionString = Configuration.GetConnectionString("CareTaskrDatabase");
            var migrationsAssembly = typeof(ApplicationContext).GetTypeInfo().Assembly.GetName().Name;

            services.AddDbContext<ApplicationContext>(options =>
                options.UseSqlServer(connectionString, b => b.MigrationsAssembly(migrationsAssembly)), ServiceLifetime.Transient);
            services.Configure<CareTaskrUrl>(Configuration.GetSection("CareTaskrUrl"));
            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.Configure<EmailConfiguration>(Configuration.GetSection("EmailConfiguration"));
            services.Configure<EncryptionKeys>(Configuration.GetSection("EncryptionKeys"));
            services.Configure<BlobStorageConfig>(Configuration.GetSection("BlobStorageConfig"));
            var fhirServerBaseUrl = Configuration.GetConnectionString("FhirServerBaseUrl");

            var azureBlob =  Configuration.GetSection
              (nameof(BlobStorageConfig));

            var azureStorage = azureBlob[nameof(BlobStorageConfig.StorageConnection)];
            services.AddSingleton(x => new BlobServiceClient(azureStorage));

            services.AddScoped<IFRepository, FhirRepository>((_) => new FhirRepository(fhirServerBaseUrl));


            services.AddTransient<IValidatorInterceptor, CustomInterceptor>();
            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IMyTaskService, MyTaskService>();
            services.AddScoped<IUserManagementService, UserManagementService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IDashBoardService, DashBoardService>();
            services.AddScoped<IJwtFactory, JwtFactory>();
            services.AddScoped<JwtIssuerOptions, JwtIssuerOptions>();
            services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));
            services.AddScoped<IGenericUnitOfWork, GenericUnitOfWork>();
            services.AddScoped<IFPatientService, FPatientService>();
            services.AddScoped<IListService, ListService>();
            services.AddScoped<IFClinicalInfoService, FClinicalInfoService>();
            services.AddScoped<IFMedicationService, FMedicationService>();
            services.AddScoped<IFDiagnosticsService, FDiagnosticsService>();
            services.AddScoped<IFWorkflowService, FWorkflowService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IBillingService, BillingService>();
            services.AddScoped<IProviderService, ProviderService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<ViewRender, ViewRender>();
            services.AddScoped<EncryptionService, EncryptionService>();
            services.AddScoped<IMyProfileService, MyProfileService>();
            services.AddScoped<IInvoiceService, InvoiceService>();
            services.AddScoped<INoteService, NoteService>();

            //This is needed by DbContext to get the user data from claims
            services.AddScoped<IGetClaimsProvider, GetClaimsProvider>();

            var context = new CustomAssemblyLoadContext();
            context.LoadUnmanagedLibrary(Path.Combine(Directory.GetCurrentDirectory(), "libwkhtmltox.dll"));
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));


            services
             .AddMvc(options =>
             {
                 options.Filters.Add(typeof(CustomExceptionFilterAttribute));
             })
              .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<UserRegistrationValidator>());


            // jwt wire up
            // Get options from app settings
            var jwtAppSettingOptions = Configuration.GetSection
                (nameof(JwtIssuerOptions));
            var secretKey = jwtAppSettingOptions[nameof(JwtIssuerOptions.SecretKey)];
            var _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,

                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };


            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
            });

            // Configure JwtIssuerOptions
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });
            services.AddHttpContextAccessor();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();



            services.AddAuthorization(options =>
            {
                AuthorizationHelper.SetAuthorizationOptions(ref options);
            });

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                //options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
                options.SerializerSettings.MissingMemberHandling = MissingMemberHandling.Ignore;
            });

            var dataSection = Configuration.GetSection("Data");
            if (dataSection.Exists() && Boolean.Parse(dataSection["SeedData"]))
            {
                SeedData.Seed(services);
            }


            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                
                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);

            });
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });



        }



        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors("CorsPolicy");
            app.UseHttpsRedirection();
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");

            });

            CustomHttpContext.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>());

      
        

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:4200/");
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
