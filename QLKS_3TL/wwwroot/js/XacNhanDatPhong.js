function showModal(maDatPhong) {
    // Gửi yêu cầu đến controller để lấy thông tin đặt phòng
    $.ajax({
        url: '/LeTan/XacNhanDatPhong/XacNhanThongTin', // Địa chỉ action lấy thông tin đặt phòng
        type: 'GET',
        data: { maDatPhong: maDatPhong },
        success: function (response) {
            // Cập nhật model cho modal
            $('#XacNhan1').html(response);
            $('#XacNhan1').modal('show');
        }
    });
}
