
$(document).ready(function () {
    $.ajax({
        url: '/KhachHang/DatPhong/GetSoLuongPhong',
        method: 'GET',
        success: function (data) {
            // Cập nhật số lượng phòng vào thẻ h2
            $('#ThongKePhong').text(data.soLuongPhong);
        }
    });
});
// so luong nhan vien
$(document).ready(function () {
    $.ajax({
        url: '/KhachHang/DatPhong/GetSoLuongNhanVien',
        method: 'GET',
        success: function (data) {
            // Cập nhật số lượng phòng vào thẻ h2
            $('#ThongKeNhanVien').text(data.soLuongNhanVien);
        }
    });
});
// so luong khach hang
$(document).ready(function () {
    $.ajax({
        url: '/KhachHang/DatPhong/GetSoLuongKhachHang',
        method: 'GET',
        success: function (data) {
            // Cập nhật số lượng phòng vào thẻ h2
            $('#ThongKeKhachHang').text(data.soLuongKhachHang);
        }
    });
});