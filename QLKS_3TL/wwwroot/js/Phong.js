$('#btnOpenModal').on('click', function () {
    $.get("/QuanLy/QuanLyPhong/Create", function (data) {
        $('#ThemModal').html(data);  // Chèn dữ liệu vào div có id="ThemModal"
        $('#ModalThem').modal('show');  // Hiển thị modal
    }).fail(function (xhr, status, error) {
        console.log("Lỗi tải dữ liệu: ", error);
    });
});

function loadPhong() {
    console.log("Load đã chạy");
    $.ajax({
        url: '/QuanLy/QuanLyPhong/LoadPhong', // Thay bằng URL chính xác của bạn
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response); // Kiểm tra cấu trúc response trong console
            if (response.success) {
                let tableContent = '';
                let stt = 1;

                // Duyệt qua dữ liệu phòng trả về
                response.data.forEach(function (item) {
                    tableContent += `
                        <tr>
                            <th scope="row">${stt}</th>
                            <td>${item.maHangPhong || ''}</td>
                            <td>${item.tenHangPhong || ''}</td>
                            <td style="padding-left: 30px;">${item.maPhong || ''}</td>
                            <td>${item.giaHangPhong ? item.giaHangPhong + ' VND' : ''}</td>
                            <td class="d-flex justify-content-end">
                                <button type="button" class="btn btn-danger delete-btn" data-id="${item.maPhong || ''}" style="font-size: small;">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    `;
                    stt++;
                });

                // Cập nhật bảng bằng nội dung mới
                $('#tblBody').html(tableContent);
            } else {
                alert('Lỗi: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}



// Khi modal được mở, gọi API lấy danh sách hạng phòng
$('#btnOpenModal').on('click', function () {
    $.ajax({
        url: '/QuanLy/QuanLyPhong/GetHangPhongOptions', // Đảm bảo URL này chính xác
        type: 'GET',
        success: function (data) {
            if (data && Array.isArray(data)) {
                var options = '<option selected value="">Chọn hạng phòng</option>';
                data.forEach(function (item) {
                    // Kiểm tra xem item có đúng các thuộc tính maHangPhong và tenHangPhong không
                    if (item.maHangPhong && item.tenHangPhong) {
                        options += '<option value="' + item.maHangPhong + '">' + item.tenHangPhong + '</option>';
                    }
                });
                // Cập nhật dữ liệu vào dropdown
                $('#HangPhong').html(options);
            } else {
                console.log("Dữ liệu không hợp lệ:", data);
            }

            // Mở modal sau khi dữ liệu được cập nhật
            $('#ModalThem').modal('show');
        },
        error: function (xhr, status, error) {
            console.log("Có lỗi xảy ra khi lấy dữ liệu hạng phòng: ", error);
        }
    });
});

function ThemPhong() {
    console.log("Bạn đã bấm vào nút Thêm phòng 111");

    // Lấy giá trị của các input trong modal
    var hangPhong = $('#HangPhong').val();
    var tenPhong = $('#tenPhong').val();

    console.log("Hạng phòng: " + hangPhong + ", Tên phòng: " + tenPhong); // Kiểm tra giá trị đầu vào

    // Kiểm tra nếu các trường thông tin không rỗng
    if (!hangPhong || !tenPhong) {
        if (!hangPhong) {
            $('#errorHangPhong').text('Vui lòng chọn hạng phòng');
        }
        if (!tenPhong) {
            $('#errorTenPhong').text('Vui lòng nhập tên phòng');
        }
        return;
    }

    // Gửi dữ liệu đến server qua Ajax
    $.ajax({
        url: '/QuanLy/QuanLyPhong/Create', // Đảm bảo URL này chính xác
        type: 'POST',
        data: {
            maHangPhong: hangPhong,
            tenPhong: tenPhong
        },
        success: function (response) {
            if (response.success) {
                // Nếu thêm thành công, đóng modal và cập nhật dữ liệu
                $('#ModalThem').modal('hide');
                alert('Thêm phòng thành công');

                // Cập nhật giao diện hoặc làm mới danh sách phòng (ví dụ là làm mới bảng)
                loadPhong();
            } else {
                alert('Lỗi: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            alert('Có lỗi xảy ra: ' + error);
        }
    });
}

$(document).ready(function () {
    $('#timkiemphong').on('input', function () {
        var query = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
        $('#tblBody tr').each(function () {
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
    $('.delete-button').click(function () {
        var maPhong = $(this).data('id');  // Lấy giá trị từ data-id
        console.log(maPhong);  // Kiểm tra giá trị
        if (maPhong === undefined || maPhong === "") {
            alert("Giá trị MaPhong không hợp lệ.");
            return;
        }

        if (confirm('Bạn có chắc muốn xóa mục này?')) {
            $.ajax({
                url: dlPhong,
                type: 'POST',
                data: { maPhong: maPhong },
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        loadPhong()
                    } else {
                        alert(response.message); // Hiển thị thông báo lỗi
                    }
                },
                error: function () {
                    alert('Có lỗi xảy ra, vui lòng thử lại');
                }
            });
        }
    });
});

