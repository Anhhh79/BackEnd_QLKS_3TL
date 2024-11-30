    
    $('#createProductBtn').on('click', function () {
        $.get(createProductUrl, function (data) {
            $('#modalPlaceholder').html(data);
            $('#createModal').modal('show');
        });
    });
    // load dữ liệu
function loadHangPhong() {
    $.ajax({
        url: load, // Đảm bảo URL đúng với controller của bạn
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                let tableContent = '';
                let stt = 1;

                response.data.forEach(function (hp) {
                    tableContent += `
                        <tr>
                            <th scope="row">${stt}</th>
                            <td>${hp.maHangPhong || ''}</td>
                            <td>${hp.tenHangPhong || ''}</td>
                            <td style="padding-left: 37px;">${hp.soGiuong || ''}</td>
                            <td style="padding-left: 30px;">${hp.dienTich || ''}</td>
                            <td>${hp.giaHangPhong || ''} VND</td>
                            <td class="d-flex justify-content-end">
                                <a class="cusor me-2 mt-1 chitietBtn" onclick="loadRoomDetail('${hp.maHangPhong || ''}')"
                                   style="color: darkblue; font-style: italic; text-decoration: underline;">
                                    Chi tiết
                                </a>
                                <button type="button" class="btn btn-warning me-2 editBtn" data-toggle="modal" data-target="#editModal" data-id="${hp.maHangPhong || ''}" style="font-size: small;">
                                    Sửa
                                </button>
                                <button type="button" class="btn btn-danger delete-btn" data-id="${hp.maHangPhong || ''}"
                                        style="font-size: small;">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    `;
                    stt++;
                });

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


//Tìm kiếm
$(document).ready(function () {
    $('#searchInput').on('input', function () {
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

    // Tách hàm kiểm tra lỗi
function validateForm() {
        console.log("running")
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
        }

        return isValid;
    }

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
                    alert("Thêm hạng phòng thành công!");
                    $('#createModal').modal('hide');
                    loadHangPhong();
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
$(document).on('submit', '#editProductForm', function (e) {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Reset lỗi trước khi bắt đầu
    resetErrors();

    var isValid = true;
    var tenHangPhong = $('#EdittenHangPhong').val(); // Lấy giá trị từ input
    console.log("Tên hạng phòng:", tenHangPhong); // Kiểm tra giá trị
    if (!tenHangPhong) {
        $('#EditerrorTenHangPhong').text("Tên hạng phòng không được để trống");
        isValid = false; // Đánh dấu là lỗi
    }

    // Kiểm tra Giá
    var giaHangPhong = $('#Editgia').val().trim();
    if (giaHangPhong === "" || isNaN(giaHangPhong) || giaHangPhong <= 0) {
        $('#EditerrorGia').text("Giá hạng phòng phải là số lớn hơn 0.");
        isValid = false;
    }

    // Kiểm tra Số giường
    var soGiuong = $('#EditsoGiuong').val().trim();
    if (soGiuong === "" || isNaN(soGiuong) || soGiuong <= 0) {
        $('#EditerrorSoGiuong').text("Số giường phải là số lớn hơn 0.");
        isValid = false;
    }

    // Kiểm tra Diện tích
    var dienTich = $('#EditdienTich').val().trim();
    if (dienTich === "" || isNaN(dienTich) || dienTich <= 0) {
        $('#EditerrorDienTich').text("Diện tích phải là số lớn hơn 0.");
        isValid = false;
    }

    // Kiểm tra Mô tả
    var moTa = $('#EditmoTa').val().trim();
    if (moTa === "") {
        $('#EditerrorMoTa').text("Mô tả không được để trống.");
        isValid = false;
    }

    // Kiểm tra ảnh (nếu có trường ảnh)
    var anhHangPhong = $('#Edimage').prop('files')[0];
    if (anhHangPhong && anhHangPhong.size > 5000000) { // Kiểm tra kích thước ảnh (5MB)
        $('#EditerrorImage').text("Ảnh tải lên không được lớn hơn 5MB.");
        isValid = false;
    }

    // Nếu tất cả trường hợp đều hợp lệ, thực hiện gửi dữ liệu
    if (isValid) {
        var form = $(this);
        var formData = new FormData(form[0]);

        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success) {
                    alert("Cập nhật thành công!");
                    $('#editModal').modal('hide'); // Đóng modal khi thành công
                    loadHangPhong(); // Tải lại danh sách
                } else {
                    alert("Có lỗi xảy ra: " + (response.message || "Đã xảy ra lỗi không xác định."));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Lỗi: ' + errorThrown);
            }
        });
    }
});

// Hàm để reset lỗi
function resetErrors() {
    $('#EditerrorTenHangPhong').text("");
    $('#EditerrorGia').text("");
    $('#EditerrorSoGiuong').text("");
    $('#EditerrorDienTich').text("");
    $('#EditerrorMoTa').text("");
    $('#EditerrorImage').text("");
}

function validateEditForm() {
    console.log("Running validateEditForm");
    var isValid = true;

    // Lấy giá trị từ các trường
    var tenHangPhong = document.getElementById('EdittenHangPhong').value.trim();
    var gia = document.getElementById('Editgia').value.trim();
    var soGiuong = document.getElementById('EditsoGiuong').value.trim();
    var dienTich = document.getElementById('EditdienTich').value.trim();
    var image = document.getElementById('Edimage').value;
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
    } 
    return isValid;
}

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
                    loadHangPhong();
                } else {
                    alert("Có lỗi xảy ra: " + response.message);
                }
            }
        });
    }
});
$(document).ready(function () {
    $('#doimatkhau').on('click', function () {
        const currentPassword = $('#mkHienTai').val().trim();
        const newPassword = $('#mkMoi').val().trim();
        const confirmNewPassword = $('#mkMoi1').val().trim();

        // Xóa các thông báo lỗi cũ
        $('.text-danger').text('');

        // Kiểm tra các trường rỗng
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            if (!currentPassword) {
                $('#mkHienTaiError').text('Vui lòng nhập mật khẩu hiện tại.');
            }
            if (!newPassword) {
                $('#mkMoiError').text('Vui lòng nhập mật khẩu mới.');
            }
            if (!confirmNewPassword) {
                $('#mkMoi1Error').text('Vui lòng xác nhận mật khẩu mới.');
            }
            return;
        }

        // Kiểm tra mật khẩu mới phải đủ mạnh
        if (newPassword.length < 6) {
            $('#mkMoiError').text('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
        if (currentPassword === newPassword) {
            $('#mkMoiError').text('Mật khẩu mới không được giống mật khẩu hiện tại.');
            return;
        }

        // Gửi dữ liệu qua AJAX
        $.ajax({
            url: '/Admin/DoiMatKhau/ChangePassword',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify({
                CurrentPassword: currentPassword,
                NewPassword: newPassword,
                ConfirmNewPassword: confirmNewPassword
            }),
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    $('#userName').text(response.userName);
                    $('#avatar').attr('src', response.avatarUrl);
                    $('#doimk').modal('hide');
                } else {
                    if (response.errors) {
                        $('#mkHienTaiError').text(response.errors);
                    } else {
                        alert(response.message);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi trong quá trình xử lý.');
            }
        });
    });
});

$('#doimk').on('hidden.bs.modal', function () {
    $('.modal-backdrop').remove(); // Xóa phần tử backdrop còn sót
});

