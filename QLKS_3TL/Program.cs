using Microsoft.EntityFrameworkCore;
using QLKS_3TL.Data;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);  // Thời gian hết hạn session
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
// Add services to the container.
builder.Services.AddControllersWithViews();
//Đăng ký chuỗi kết nối CSDL
builder.Services.AddDbContext<Qlks3tlContext>(options => { options.UseSqlServer(builder.Configuration.GetConnectionString("Conn3TL")); });

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

    // Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
   {
    app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
   }

// Sử dụng session
app.UseSession();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{area=LeTan}/{controller=XacNhanDatPhong}/{action=Index}/{id?}");
app.Run();
