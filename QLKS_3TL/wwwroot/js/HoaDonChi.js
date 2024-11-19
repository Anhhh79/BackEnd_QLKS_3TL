function loadHoaDonList() {
    $.ajax({
        url: '/QuanLy/QuanLyHoaDonChi/GetHoaDonList',
        type: 'GET',
        success: function (data) {
            // Duyệt qua dữ liệu JSON và cập nhật danh sách hóa đơn trên trang
            let htmlContent = '';
            let stt = 1;
            data.forEach(function (item) {
                const formattedDate = item.thoiGian
                    ? new Date(item.thoiGian).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })
                    : 'N/A';
                htmlContent += `
                    <tr>
                        <th scope="row">${stt}</th>
                        <td>${item.maHoaDonChi}</td>
                        <td>${item.maNhanVien}</td>
                        <td>${item.tenMatHang}</td>
                        <td>${item.soLuong}</td>
                        <td>${item.giaMatHang}</td>
                        <td>${item.tongGia} VND</td>
                        <td class="text-center">${formattedDate}</td>
                    </tr>
                `;
                stt++;
            });
            $('#hoaDonList tbody').html(htmlContent);  // Cập nhật bảng
        },
        error: function (xhr, status, error) {
            console.error(error); // Log lỗi
            alert('Có lỗi xảy ra!');
        }
    });
}

//tìm kiếm 
$(document).ready(function () {
    $('#seachHoaDonChi').on('input', function () {
        var query = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
        $('#tblHoaDonChi tr').each(function () {
            var rowText = $(this).text().toLowerCase(); // Lấy toàn bộ văn bản của một dòng
            if (rowText.includes(query)) {  // Nếu dòng chứa chuỗi tìm kiếm
                $(this).show();  // Hiển thị dòng
            } else {
                $(this).hide();  // Ẩn dòng
            }
        });
    });
});

$(document).ready(function () {
    // Xử lý khi bấm nút Đồng ý
    $('#Dongy').on('click', function () {
        // Lấy giá trị từ các trường nhập liệu
        const tenMatHang = $('#tenMatHang').val().trim();
        const soLuong = parseInt($('#soLuong').val()) || 0;
        const giaMatHang = parseFloat($('#giaMatHang').val()) || 0;
        const tongGiaTri = $('#tongGia');

        // Xóa thông báo lỗi trước đó
        $('#errorTenMatHang').text('');
        $('#errorSoLuong').text('');
        $('#errorGia').text('');

        let hasError = false; // Biến kiểm tra lỗi

        // Kiểm tra tên mặt hàng
        if (!tenMatHang) {
            $('#errorTenMatHang').text('Vui lòng nhập tên mặt hàng.');
            hasError = true;
        }

        // Kiểm tra số lượng
        if (soLuong <= 0) {
            $('#errorSoLuong').text('Số lượng phải lớn hơn 0.');
            hasError = true;
        }

        // Kiểm tra giá
        if (giaMatHang <= 0) {
            $('#errorGia').text('Giá phải lớn hơn 0.');
            hasError = true;
        }

        // Nếu có lỗi, dừng xử lý
        if (hasError) {
            return;
        }

        // Tính tổng giá trị
        const totalValue = soLuong * giaMatHang;
        tongGiaTri.val(totalValue.toFixed(2));

        // Tạo object hóa đơn để gửi lên server
        const hoaDon = {
            TenMatHang: tenMatHang,
            SoLuong: soLuong,
            GiaMatHang: giaMatHang,
            TongGiaTri: totalValue
        };
        console.log(hoaDon);
        // Gửi yêu cầu AJAX để lưu hóa đơn
        $.ajax({
            url: '/QuanLy/QuanLyHoaDonChi/LuuHoaDon',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(hoaDon),
            success: function (response) {
                console.log(JSON.stringify(hoaDon)); // Kiểm tra dữ liệu JSON gửi đi
                alert(response); // Hiển thị thông báo thành công
                $('#hoadonchi').modal('hide'); // Ẩn modal sau khi thành công
                loadHoaDonList() // Reload để cập nhật danh sách hóa đơn
            },
            error: function (xhr, status, error) {
                console.error(error); // Log lỗi
                alert('Có lỗi xảy ra!');
            }
        });
    });

    // Cập nhật tổng giá trị khi nhập số lượng hoặc giá
    $('#soLuong, #giaMatHang').on('input', function () {
        const soLuongValue = parseInt($('#soLuong').val()) || 0;
        const giaValue = parseFloat($('#giaMatHang').val()) || 0;

        const totalValue = soLuongValue * giaValue;
        $('#tongGia').val(totalValue > 0 ? totalValue.toFixed(2) : ''); // Cập nhật tổng giá trị
    });
});

$('#hoadonchi').on('hidden.bs.modal', function () {
    $('.modal-backdrop').remove(); // Xóa phần tử backdrop còn sót
});