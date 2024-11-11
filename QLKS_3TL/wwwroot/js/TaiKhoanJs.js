$(document).ready(function () {
    // Hiển thị modal thêm tai khoan
    $('#btnThemTaiKhoan').on('click', function () {
        $('#themTaiKhoan').modal('show');
    });

    //load ma nhân viên
    LoadMaNhanVienSelect();
});

//load thông tin tài khoản
function LoadTaiKhoan() {
    // Đường dẫn đến phương thức trong controller để lấy thông tin
    const baseUrl = '/QuanLy/QuanLyTaiKhoan/LoadTaiKhoans';
    $.ajax({
        url: baseUrl,  // Tạo URL
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            // Kiểm tra xem phản hồi có thành công không và có chứa dữ liệu không
            if (!response.success || !response.data || response.data.length === 0) {
                let object = '<tr><td colspan="8" class="text-center">Không có tài khoản nào để hiển thị</td></tr>';
                $('#bodyThongTinTaiKhoan').html(object);
            } else {
                let soThuTu = 1;
                let object = '';
                $.each(response.data, function (index, item) {
                    object += `
                    <tr>
                       <th scope="row">${soThuTu++}</th>
                       <td>${item.hoTen}</td>
                       <td>${item.chucVu}</td>
                       <td>${item.taiKhoan}</td>
                       <td>${item.matKhau}</td>
                       <td class="d-flex justify-content-around">
                       <button type="button" class="btn btn-danger" onclick="DeleteTaiKhoan('${item.maNhanVien}')" style="font-size: small;">Xóa</button></td>
                    </tr>`;
                });
                $('#bodyThongTinTaiKhoan').html(object);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin tài khoản:', textStatus, errorThrown);
            alert('Không thể lấy thông tin tài khoản. Vui lòng kiểm tra lại.');
        }
    });
}

//Lấy thông tin nhân viên đưa lên modal
document.addEventListener('DOMContentLoaded', function () {
    const maNhanVienSelect = document.getElementById('MaNhanVienSelect');
    if (maNhanVienSelect) {
        maNhanVienSelect.addEventListener('change', function () {
            const maNhanVien = this.value;

            if (maNhanVien) {
                // Gọi AJAX để lấy thông tin nhân viên
                $.ajax({
                    url: `/QuanLy/QuanLyTaiKhoan/LayThongTinNhanVien?maNhanVien=${maNhanVien}`,
                    type: 'GET',
                    success: function (response) {
                        if (response.success) {
                            document.getElementById('HoTenNhanVien').innerText = response.data.hoTen;
                            document.getElementById('ChucVuNhanVien').innerText = response.data.chucVu;
                        } else {
                            document.getElementById('HoTenNhanVien').innerText = 'Chưa chọn';
                            document.getElementById('ChucVuNhanVien').innerText = 'Chưa chọn';
                            alert(response.message);
                        }
                    },
                    error: function () {
                        alert("Lỗi khi lấy thông tin nhân viên");
                    }
                });
            } else {
                document.getElementById('HoTenNhanVien').innerText = 'Chưa chọn';
                document.getElementById('ChucVuNhanVien').innerText = 'Chưa chọn';
            }
        });
    }
});

//check data 
function checkDataTaikhoan() {
    // Lấy giá trị từ các trường nhập liệu
    const passwordInput = document.getElementById('passwordTaiKhoan');
    const maNhanVienInput = document.getElementById('MaNhanVienSelect');
    const password = passwordInput.value.trim(); // Loại bỏ khoảng trắng

    // Xóa thông báo lỗi trước đó (nếu có)
    document.getElementById('errorPasswordTaiKhoan').innerText = '';
    document.getElementById('errorMaNhanVienSelect').innerText = '';

    let hasError = true; // Biến để kiểm tra có lỗi hay không

    // Biểu thức chính quy để kiểm tra ký tự đặc biệt
    const specialCharRegex = /[!#$%^&*(),.?":{}|<>]/g;

    if (maNhanVienInput.value.trim() === '') {
        document.getElementById('errorMaNhanVienSelect').innerText = 'Vui lòng chọn mã nhân viên.';
        hasError = false;
    }

    // Kiểm tra mật khẩu
    if (password === '') {
        document.getElementById('errorPasswordTaiKhoan').innerText = 'Vui lòng nhập mật khẩu.';
        hasError = false;
    } else if (password.length < 6) {
        document.getElementById('errorPasswordTaiKhoan').innerText = 'Mật khẩu phải có ít nhất 6 ký tự.';
        hasError = false;
    } else if (specialCharRegex.test(password)) {
        document.getElementById('errorPasswordTaiKhoan').innerText = 'Mật khẩu không được chứa ký tự đặc biệt.';
        hasError = false;
    }

    // Nếu không có lỗi, tiếp tục xử lý thêm tài khoản
    if (hasError) {
        InsertTaikhoan()
    }

    return hasError;
}

// Hàm Insert để thêm tài khoản
function InsertTaikhoan() {
    var maNhanVien = $('#MaNhanVienSelect').val();
    var matKhau = $('#passwordTaiKhoan').val().trim();
    var chucVu = $('#ChucVuNhanVien').val();

    // Xác định quyền truy cập dựa trên chức vụ
    var quyenTruyCapInput;
    if (chucVu === "Quản lý") {
        quyenTruyCapInput = '1'; // Quản lý
    } else if (chucVu === "Lễ tân") {
        quyenTruyCapInput = '2'; // Lễ tân
    } else {
        quyenTruyCapInput = '3'; // Các chức vụ khác, bạn có thể thay đổi nếu cần
    }
    var data =
    {
        MaNhanVien: maNhanVien,
        MatKhau: matKhau,
        TaiKhoan1: maNhanVien,  // Hoặc tên tài khoản nếu có
        QuyenTruyCap: quyenTruyCapInput
    }
    // Gửi yêu cầu AJAX
    $.ajax({
        url: '/QuanLy/QuanLyTaiKhoan/Insert', // Đổi URL này thành URL của bạn
        type: 'POST',
        contentType: 'application/json', // Đảm bảo dữ liệu được gửi dưới dạng JSON
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success) {
                alert("Thêm tài khoản cho nhân viên thành công!");
                $('#themTaiKhoan').modal('hide'); // Ẩn modal sau khi thêm thành công

                // Làm sạch các trường nhập liệu trong modal
                $('#MaNhanVienSelect').val('');
                $('#passwordTaiKhoan').val('');
                $('#HoTenNhanVien').text('Chưa chọn');
                $('#ChucVuNhanVien').text('Chưa chọn'); // Reset lại giá trị của select
                LoadTaiKhoan();
                LoadMaNhanVienSelect();
            } else {
                $('#MaNhanVienSelect').val('');
                $('#passwordTaiKhoan').val('');
                $('#HoTenNhanVien').text('Chưa chọn');
                $('#ChucVuNhanVien').text('Chưa chọn');
                alert(response.message);
                console.error("Lỗi:", response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            alert("Đã xảy ra lỗi khi thêm tài khoản. Vui lòng thử lại.");
        }
    });
}


//Xóa thông tin tài khoản
function DeleteTaiKhoan(maNhanVien) {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản có mã nhân viên: " + maNhanVien + "?.")) {
        return;
    }

    const url = `/QuanLy/QuanLyTaiKhoan/Delete?maNhanVien=${maNhanVien}`;

    $.ajax({
        url: url,
        type: 'DELETE',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                LoadTaiKhoan();
                LoadMaNhanVienSelect();
                alert(response.message);
            } else {
                alert(response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Lỗi khi xóa tài khoản:", textStatus, errorThrown);
            alert("Không thể xóa tài khoản. Vui lòng thử lại.");
        }
    });
}

// Load danh sách mã nhân viên vào modal thêm tài khoản
function LoadMaNhanVienSelect() {
    // Đường dẫn đến phương thức trong controller để lấy thông tin
    const baseUrl = '/QuanLy/QuanLyTaiKhoan/GetMaNhanViens';
    $.ajax({
        url: baseUrl, // Tạo URL
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            let options = '<option value="">Chọn mã nhân viên</option>';
            $.each(response.data, function (index, maNhanVien) {
                options += `<option value="${maNhanVien}">${maNhanVien}</option>`;
            });
            $('#MaNhanVienSelect').html(options);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy danh sách mã nhân viên:', textStatus, errorThrown);
            alert('Không thể tải danh sách mã nhân viên. Vui lòng thử lại.');
        }
    });
}



