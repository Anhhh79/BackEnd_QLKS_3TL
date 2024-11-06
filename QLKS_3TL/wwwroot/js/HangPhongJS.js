
    $('#createProductBtn').on('click', function () {
        $.get(createProductUrl, function (data) {
            $('#modalPlaceholder').html(data);
            $('#createModal').modal('show');
        });
    });

    // Tách hàm kiểm tra lỗi
    function validateForm() {
        var isValid = true;

        // Lấy giá trị từ các trường
        var tenHangPhong = document.getElementById('tenHangPhong').value.trim();
        var gia = document.getElementById('gia').value.trim();
        var soGiuong = document.getElementById('soGiuong').value.trim();
        var dienTich = document.getElementById('dienTich').value.trim();
        var image = document.getElementById('imageInput').value;
        var moTa = document.getElementById('moTa').value.trim();

        var specialCharRegex = /[^a-zA-Z0-9\s]/g;

        // Xóa thông báo lỗi cũ
        document.getElementById('errorTenHangPhong').textContent = '';
        document.getElementById('errorGia').textContent = '';
        document.getElementById('errorSoGiuong').textContent = '';
        document.getElementById('errorDienTich').textContent = '';
        document.getElementById('errorImage').textContent = '';
        document.getElementById('errorMoTa').textContent = '';

        // Kiểm tra "Tên hạng phòng"
        if (tenHangPhong === '') {
            document.getElementById('errorTenHangPhong').textContent = 'Tên hạng phòng không được để trống';
            isValid = false;
        } else if (specialCharRegex.test(tenHangPhong)) {
            document.getElementById('errorTenHangPhong').textContent = 'Tên hạng phòng không được chứa ký tự đặc biệt';
            isValid = false;
        }

        // Kiểm tra "Giá"
        if (gia === '' || isNaN(gia) || Number(gia) <= 0) {
            document.getElementById('errorGia').textContent = 'Giá phải không được để trống và phải lớn hơn 0';
            isValid = false;
        }

        // Kiểm tra "Số giường"
        if (soGiuong === '' || isNaN(soGiuong) || Number(soGiuong) <= 0) {
            document.getElementById('errorSoGiuong').textContent = 'Số giường không được để trống và phải lớn hơn 0';
            isValid = false;
        }

        // Kiểm tra "Diện tích"
        if (dienTich === '' || isNaN(dienTich) || Number(dienTich) <= 0) {
            document.getElementById('errorDienTich').textContent = 'Diện tích không được để trống và phải lớn hơn 0';
            isValid = false;
        }

        // Kiểm tra "Ảnh"
        if (image === '') {
            document.getElementById('errorImage').textContent = 'Vui lòng chọn ảnh';
            isValid = false;
        }

        // Kiểm tra "Mô tả"
        if (moTa === '') {
            document.getElementById('errorMoTa').textContent = 'Mô tả không được để trống';
            isValid = false;
        } else if (specialCharRegex.test(moTa)) {
            document.getElementById('errorMoTa').textContent = 'Mô tả không được chứa ký tự đặc biệt';
            isValid = false;
        }

        return isValid;
    }

    // Xử lý sự kiện khi biểu mẫu tạo sản phẩm được gửi
    $(document).on('submit', '#createProductForm', function (e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định của biểu mẫu

        if (!validateForm()) {
            return; // Ngăn chặn hành động gửi nếu có lỗi
        }

        var form = $(this);
        var formData = new FormData(form[0]); // Tạo FormData từ biểu mẫu

        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: formData,
            contentType: false, // Không thiết lập contentType
            processData: false, // Không xử lý dữ liệu
        })
            .done(function (response) {
                console.log(response); // Thêm dòng này để xem phản hồi
                if (response.success) {
                    alert("Thêm sản phẩm thành công!");
                    location.reload();
                } else {
                    alert("Có lỗi xảy ra: " + (response.message || "Đã xảy ra lỗi không xác định.")); // Kiểm tra và hiển thị thông báo
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                alert('Lỗi: ' + errorThrown);
            });
    });
    $(document).on('click', '.editBtn', function () {
        var maHangPhong = $(this).data('id'); // Lấy id của sản phẩm
        // Gọi AJAX để lấy nội dung modal từ server
        $.get(getProductUrl + '?maHangPhong=' + maHangPhong, function (data) {
            $('#modalPlaceholderEdit').html(data); // Thêm nội dung vào modalPlaceholder
            $('#editModal').modal('show'); // Hiển thị modal
        }).fail(function () {
            alert("Không thể tải modal. Kiểm tra lại đường dẫn hoặc controller.");
        });
    });
    // Hàm kiểm tra lỗi cho phần cập nhật sản phẩm
    function validateEditForm() {
        var isValid = true;

        // Lấy giá trị từ các trường
        var tenHangPhong = document.getElementById('EdittenHangPhong').value.trim();
        var gia = document.getElementById('Editgia').value.trim();
        var soGiuong = document.getElementById('EditsoGiuong').value.trim();
        var dienTich = document.getElementById('EditdienTich').value.trim();
        var image = document.getElementById('EditimageInput').value;
        var moTa = document.getElementById('EditmoTa').value.trim();

        var specialCharRegex = /[^a-zA-Z0-9\s]/g; // Biểu thức kiểm tra ký tự đặc biệt

        // Xóa thông báo lỗi cũ
        document.getElementById('EditerrorTenHangPhong').textContent = '';
        document.getElementById('EditerrorGia').textContent = '';
        document.getElementById('EditerrorSoGiuong').textContent = '';
        document.getElementById('EditerrorDienTich').textContent = '';
        document.getElementById('EditerrorImage').textContent = '';
        document.getElementById('EditerrorMoTa').textContent = '';

        // Kiểm tra "Tên hạng phòng"
        if (tenHangPhong === '') {
            document.getElementById('EditerrorTenHangPhong').textContent = 'Tên hạng phòng không được để trống';
            isValid = false;
        } else if (specialCharRegex.test(tenHangPhong)) {
            document.getElementById('EditerrorTenHangPhong').textContent = 'Tên hạng phòng không được chứa ký tự đặc biệt';
            isValid = false;
        }

        // Kiểm tra "Giá"
        if (gia === '' || isNaN(gia) || Number(gia) <= 0) {
            document.getElementById('EditerrorGia').textContent = 'Giá phải không được để trống và lớn hơn 0';
            isValid = false;
        }

        // Kiểm tra "Số giường"
        if (soGiuong === '' || isNaN(soGiuong) || Number(soGiuong) <= 0) {
            document.getElementById('EditerrorSoGiuong').textContent = 'Số giường không được để trống và lớn hơn 0';
            isValid = false;
        }

        // Kiểm tra "Diện tích"
        if (dienTich === '' || isNaN(dienTich) || Number(dienTich) <= 0) {
            document.getElementById('EditerrorDienTich').textContent = 'Diện tích không được để trống và phải lớn hơn 0';
            isValid = false;
        }

        // Kiểm tra "Ảnh"
        if (image === '') {
            document.getElementById('EditerrorImage').textContent = 'Vui lòng chọn ảnh';
            isValid = false;
        }

        // Kiểm tra "Mô tả"
        if (moTa === '') {
            document.getElementById('EditerrorMoTa').textContent = 'Mô tả không được để trống';
            isValid = false;
        } else if (specialCharRegex.test(moTa)) {
            document.getElementById('EditerrorMoTa').textContent = 'Mô tả không được chứa ký tự đặc biệt';
            isValid = false;
        }

        return isValid;
    }

$(document).ready(function () {
    // Đăng ký sự kiện khi form được gửi
    $(document).on('submit', '#editProductForm', function (e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form
        // Hiển thị spinner khi gửi yêu cầu
        $('#loadingSpinner').show();
        // Thực hiện AJAX POST để gửi dữ liệu lên server
        $.ajax({
            url: $(this).attr('action'), // URL lấy từ thuộc tính action của form
            type: 'POST',
            data: new FormData(this), // Sử dụng FormData để gửi file
            contentType: false, // Ngăn jQuery thiết lập contentType
            processData: false, // Ngăn jQuery xử lý dữ liệu
            success: function (response) {
                console.log(response)
                $('#loadingSpinner').hide(); // Ẩn spinner sau khi nhận được phản hồi
                if (response.success) {
                    // Hiển thị thông báo thành công
                    alert("Cập nhật thành công!");

                    // Đóng modal
                    $('#editModal').modal('hide');

                    // Làm mới hoặc cập nhật danh sách trên trang
                    location.reload(); // Hoặc bạn có thể dùng AJAX để cập nhật chỉ phần danh sách
                } else {
                    // Hiển thị thông báo lỗi nếu có lỗi phía server
                    alert("Có lỗi xảy ra: " + response.message); // Hiển thị thông báo lỗi chi tiết
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#loadingSpinner').hide(); // Ẩn spinner nếu có lỗi
                console.log("Chi tiết lỗi: ", jqXHR.responseText); // In chi tiết lỗi ra console
                alert('Lỗi: ' + errorThrown);
            }
        });
    });
});

function loadRoomDetail(roomCode) {
    $.ajax({
        url: ChiTietProductUrl,
        type: 'GET',
        data: { maHangPhong: roomCode },
        success: function (data) {
            console.log(data); // Kiểm tra phản hồi từ server

            // Kiểm tra xem dữ liệu có tồn tại không
            if (data) {
                // Cập nhật dữ liệu vào modal
                $('#modalRoomImage').attr('src', data.anhHangPhong); // Chú ý tên trường
                $('#modalRoomName').text(data.tenHangPhong); // Chú ý tên trường
                $('#modalRoomCode').text(data.maHangPhong); // Chú ý tên trường
                $('#modalRoomBeds').text(data.soGiuong); // Chú ý tên trường
                $('#modalRoomArea').text(data.dienTich + ' m²'); // Chú ý tên trường
                $('#modalRoomPrice').text(data.giaHangPhong + 'VND'); // Chú ý tên trường
                $('#modalRoomDescription').html(data.moTa.replace(/\r\n/g, '<br/>')); // Sử dụng html để chèn xuống dòng

                // Hiển thị modal
                $('#chitiet').modal('show');
            } else {
                alert("Không tìm thấy dữ liệu cho hạng phòng này.");
            }
        },
        error: function () {
            alert("Có lỗi xảy ra khi tải thông tin hạng phòng.");
        }
    });
}

$(document).on('click', '.delete-btn', function () {
    var maHangPhong = $(this).data('id'); // Lấy ID từ thuộc tính data-id

    if (confirm("Bạn có chắc chắn muốn xóa hạng phòng này không?")) {
        $.ajax({
            url: XoaProductUrl, // Thay ControllerName bằng tên controller của bạn
            type: 'POST',
            data: { maHangPhong: maHangPhong }, // Gửi ID để xóa
            success: function (response) {
                if (response.success) {
                    alert("Xóa thành công!");
                    location.reload(); // Làm mới trang hoặc cập nhật danh sách
                } else {
                    alert("Có lỗi xảy ra: " + response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Chi tiết lỗi: ", jqXHR.responseText);
                alert('Lỗi: ' + errorThrown);
            }
        });
    }
});



