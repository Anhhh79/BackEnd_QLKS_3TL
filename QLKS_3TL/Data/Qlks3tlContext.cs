using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace QLKS_3TL.Data;

public partial class Qlks3tlContext : DbContext
{
    public Qlks3tlContext()
    {
    }

    public Qlks3tlContext(DbContextOptions<Qlks3tlContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DanhGia> DanhGia { get; set; }

    public virtual DbSet<HangPhong> HangPhongs { get; set; }

    public virtual DbSet<HoaDonChi> HoaDonChis { get; set; }

    public virtual DbSet<HoaDonThu> HoaDonThus { get; set; }

    public virtual DbSet<KhachHang> KhachHangs { get; set; }

    public virtual DbSet<NhanVien> NhanViens { get; set; }

    public virtual DbSet<Phong> Phongs { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<ThongTinDatPhong> ThongTinDatPhongs { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Data Source=BAPC\\SQL23;Initial Catalog=QLKS_3TL;Integrated Security=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DanhGia>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DanhGia__3214EC279B5DAEDF");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.HoTen).HasMaxLength(250);
            entity.Property(e => e.MaNhanVien)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.MaNhanVienNavigation).WithMany(p => p.DanhGia)
                .HasForeignKey(d => d.MaNhanVien)
                .HasConstraintName("FK_DanhGia_NhanVien");
        });

        modelBuilder.Entity<HangPhong>(entity =>
        {
            entity.HasKey(e => e.MaHangPhong).HasName("PK__HangPhon__5160B760CE21EDDA");

            entity.ToTable("HangPhong");

            entity.Property(e => e.MaHangPhong)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AnhHangPhong)
                .HasMaxLength(2000)
                .IsUnicode(false);
            entity.Property(e => e.GiaHangPhong).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MoTa).HasMaxLength(1000);
            entity.Property(e => e.TenHangPhong).HasMaxLength(500);
        });

        modelBuilder.Entity<HoaDonChi>(entity =>
        {
            entity.HasKey(e => e.MaHoaDonChi).HasName("PK__HoaDonCh__835ED13B6DE1F094");

            entity.ToTable("HoaDonChi");

            entity.Property(e => e.MaHoaDonChi)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaNhanVien)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TenMatHang)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ThoiGian).HasColumnType("datetime");
            entity.Property(e => e.TongGia).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.MaNhanVienNavigation).WithMany(p => p.HoaDonChis)
                .HasForeignKey(d => d.MaNhanVien)
                .HasConstraintName("fkey_MaNhanVienChi");
        });

        modelBuilder.Entity<HoaDonThu>(entity =>
        {
            entity.HasKey(e => e.MaHoaDonThu).HasName("PK__HoaDonTh__835ED13B766A40CF");

            entity.ToTable("HoaDonThu");

            entity.Property(e => e.MaHoaDonThu)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaDatPhong)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaNhanVien)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ThoiGian).HasColumnType("datetime");
            entity.Property(e => e.TongGia).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.MaDatPhongNavigation).WithMany(p => p.HoaDonThus)
                .HasForeignKey(d => d.MaDatPhong)
                .HasConstraintName("fkey_MaDatPhong");

            entity.HasOne(d => d.MaNhanVienNavigation).WithMany(p => p.HoaDonThus)
                .HasForeignKey(d => d.MaNhanVien)
                .HasConstraintName("fkey_MaNhanVienThu");
        });

        modelBuilder.Entity<KhachHang>(entity =>
        {
            entity.HasKey(e => e.MaKhachHang).HasName("PK__KhachHan__88D2F0E52260D07F");

            entity.ToTable("KhachHang");

            entity.Property(e => e.MaKhachHang)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Cccd)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CCCD");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.GioiTinh).HasMaxLength(100);
            entity.Property(e => e.HoTen)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<NhanVien>(entity =>
        {
            entity.HasKey(e => e.MaNhanVien).HasName("PK__NhanVien__77B2CA477EE78064");

            entity.ToTable("NhanVien");

            entity.Property(e => e.MaNhanVien)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.AnhNhanVien)
                .HasMaxLength(2000)
                .IsUnicode(false);
            entity.Property(e => e.Cccd)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("CCCD");
            entity.Property(e => e.ChucVu).HasMaxLength(50);
            entity.Property(e => e.DiaChi).HasMaxLength(250);
            entity.Property(e => e.GioiTinh).HasMaxLength(10);
            entity.Property(e => e.HoTen).HasMaxLength(250);
            entity.Property(e => e.LuongCoBan).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Phong>(entity =>
        {
            entity.HasKey(e => e.MaPhong).HasName("PK__ThongTin__20BD5E5B9EAAFBE2");

            entity.ToTable("Phong");

            entity.Property(e => e.MaPhong)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaHangPhong)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.MaHangPhongNavigation).WithMany(p => p.Phongs)
                .HasForeignKey(d => d.MaHangPhong)
                .HasConstraintName("FK__ThongTinP__MaHan__3F466844");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.MaNhanVien).HasName("PK__TaiKhoan__77B2CA47BC4070FB");

            entity.ToTable("TaiKhoan");

            entity.Property(e => e.MaNhanVien)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MatKhau)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.QuyenTruyCap)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TaiKhoan1)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("TaiKhoan");

            entity.HasOne(d => d.MaNhanVienNavigation).WithOne(p => p.TaiKhoan)
                .HasForeignKey<TaiKhoan>(d => d.MaNhanVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TaiKhoan");
        });

        modelBuilder.Entity<ThongTinDatPhong>(entity =>
        {
            entity.HasKey(e => e.MaDatPhong).HasName("PK__ThongTin__6344ADEABCFF56A8");

            entity.ToTable("ThongTinDatPhong");

            entity.Property(e => e.MaDatPhong)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaHangPhong)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaKhachHang)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaPhong)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ThoiGianDatPhong).HasColumnType("datetime");
            entity.Property(e => e.TongThanhToan).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.TrangThaiPhong).HasMaxLength(250);
            entity.Property(e => e.TrangThaiXacNhan)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.YeuCauThem)
                .HasMaxLength(1000)
                .IsUnicode(false);

            entity.HasOne(d => d.MaHangPhongNavigation).WithMany(p => p.ThongTinDatPhongs)
                .HasForeignKey(d => d.MaHangPhong)
                .HasConstraintName("fk_ttdp");

            entity.HasOne(d => d.MaKhachHangNavigation).WithMany(p => p.ThongTinDatPhongs)
                .HasForeignKey(d => d.MaKhachHang)
                .HasConstraintName("FK__ThongTinD__MaKha__04E4BC85");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.ThongTinDatPhongs)
                .HasForeignKey(d => d.MaPhong)
                .HasConstraintName("FK__ThongTinD__MaPho__46E78A0C");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
