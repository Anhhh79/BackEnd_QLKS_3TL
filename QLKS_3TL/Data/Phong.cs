using System;
using System.Collections.Generic;

namespace QLKS_3TL.Data;

public partial class Phong
{
    public string MaPhong { get; set; } = null!;

    public string? MaHangPhong { get; set; }

    public virtual HangPhong? MaHangPhongNavigation { get; set; }

    public virtual ICollection<ThongTinDatPhong> ThongTinDatPhongs { get; set; } = new List<ThongTinDatPhong>();
}
