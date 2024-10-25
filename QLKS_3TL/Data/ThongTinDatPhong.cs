using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class ThongTinDatPhong
{
    public DateOnly? NgayNhan { get; set; }

    public DateOnly? NgayTra { get; set; }

    public string? MaPhong { get; set; }

    public decimal? TongThanhToan { get; set; }

    public DateTime? ThoiGianDatPhong { get; set; }

    public string MaDatPhong { get; set; } = null!;

    public int? SoLuongPhong { get; set; }

    public int? TongSoNgay { get; set; }

    public string? MaKhachHang { get; set; }

    public string? MaHangPhong { get; set; }

    public string? TrangThaiXacNhan { get; set; }

    public string? YeuCauThem { get; set; }

    public string? TrangThaiPhong { get; set; }

    public virtual ICollection<HoaDonThu> HoaDonThus { get; set; } = new List<HoaDonThu>();

    public virtual HangPhong? MaHangPhongNavigation { get; set; }

    public virtual KhachHang? MaKhachHangNavigation { get; set; }

    public virtual Phong? MaPhongNavigation { get; set; }
}
