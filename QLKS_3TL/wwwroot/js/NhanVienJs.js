$(document).ready(function () {
    //hiển thị modal thêm nhân viên
    $('#btnThemNhanVien').on('click', function () {
        $('#ModalThemNhanVien').modal('show');
    });
});

//hiển thị thông tin chi tiết nhân viên 
function ChiTietNhanVien(maNhanVien) {
    // Xác thực mã nhân viên
    if (!maNhanVien) {
        alert('Mã nhân viên không hợp lệ.');
        return;
    }
    //Đường dẫn đến phương thức trong controller để lấy thông tin
    const baseUrl = '/QuanLy/QuanLyNhanVien/ChiTietNhanVien/';

    $.ajax({
        url: baseUrl + maNhanVien,  // Tạo URL
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                // Hiển thị thông tin nhân viên trong modal
                let object = '';
                $.each(response, function (index, item) {
                    object = `
                            <div class="container">
                                <div class="row">
                                    <div class="col-2">
                                        <img src="${item.anhNhanVien}" alt="" style="width: 130px;">
                                        <h5 class="text-center mt-2 ms-2" style="font-weight: 600;">${item.chucVu}</h5>
                                    </div>
                                    <div class="col-10">
                                        <div class="container ms-3">
                                            <div class="row">
                                                <h4 style="font-weight: 600;">
                                                    ${item.hoTen}
                                                </h4>
                                            </div>
                                            <div class="row mt-2">
                                                <div class="col-8">
                                                    <h6>
                                                        <span style="font-weight: 600;">
                                                            Căn cước công dân:
                                                        </span>
                                                        ${item.cccd}
                                                    </h6>
                                                </div>
                                                <div class="col-4">
                                                    <h6>
                                                        <span style="font-weight: 600;">
                                                            Giới Tính:
                                                        </span> ${item.gioiTinh}
                                                    </h6>
                                                </div>
                                            </div>
                                            <div class="row mt-2">
                                                <div class="col-8">
                                                    <h6>
                                                        <span style="font-weight: 600;">
                                                            Số điện thoại:
                                                        </span> ${item.soDienThoai}
                                                    </h6>
                                                </div>
                                                <div class="col-4">
                                                    <h6>
                                                        <span style="font-weight: 600;">
                                                            Địa Chỉ:
                                                        </span> ${item.diaChi}
                                                    </h6>
                                                </div>
                                            </div>
                                            <div class="row mt-2">
                                                <div class="col-8">
                                                    <h6>
                                                        <span style="font-weight: 600;">
                                                            Lương cơ bản:
                                                        </span> ${item.luongCoBan} VND
                                                    </h6>
                                                </div>
                                                <div class="col-4 d-flex pe-2 ">
                                                    <h6>
                                                        <span style="font-weight: 600;">
                                                            Mã Nhân Viên:
                                                        </span> ${item.maNhanVien}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                });
                $('#NhanVienChiTiet').html(object);
                $('#ModalNhanVienChiTiet').modal('show'); // Hiển thị modal
            } else {
                // Hiển thị thông báo cho bất kỳ lỗi nào từ máy chủ
                alert(response.message || 'Đã xảy ra lỗi khi lấy thông tin nhân viên.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin nhân viên:', textStatus, errorThrown);
            alert('Không thể lấy thông tin nhân viên. Vui lòng kiểm tra lại.');
        }
    });
}

//Thêm nhân viên
// Hàm Insert để thêm nhân viên
function InsertNhanVien() {
    // Lấy dữ liệu từ các trường trong modal 
    //Tạo FormData để gửi dữ liệu kèm file ảnh(nếu có)
    const formData = new FormData();
    formData.append('hoTen', $('#fullNameNhanVien').val().trim());
    formData.append('gioiTinh', $('#genderNhanVien').val());
    formData.append('cccd', $('#cccdNhanVien').val().trim());
    formData.append('soDienThoai', $('#phoneNhanVien').val().trim());
    formData.append('chucVu', $('#positionNhanVien').val());
    formData.append('diaChi', $('#addressNhanVien').val().trim());
    formData.append('luongCoBan', $('#LuongCoBanNhanVien').val().trim());
    const imageFile = $('#AddimageInputNhanVien')[0].files[0];
    if (imageFile) {
        formData.append('AnhNhanVien', imageFile); // Gửi file ảnh
    }

    // Gửi AJAX request đến server
    $.ajax({
        url: '/QuanLy/QuanLyNhanVien/Insert', // Thay thế bằng URL của bạn
        data: formData,
        type: 'post',
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                alert("Thêm nhân viên thành công!");
                $('#ModalThemNhanVien').modal('hide'); // Ẩn modal sau khi thêm thành công
                //Làm sạch các trường nhập liệu
                document.getElementById('fullNameNhanVien').value = '';
                //document.getElementById('genderNhanVien').value = '';
                document.getElementById('cccdNhanVien').value = '';
                document.getElementById('phoneNhanVien').value = '';
                //document.getElementById('positionNhanVien').value = '';
                document.getElementById('addressNhanVien').value = '';
                document.getElementById('AddimageInputNhanVien').value = '';
                document.getElementById('LuongCoBanNhanVien').value = '';
                //Cập nhật danh sách nhân viên có thể tạo hàm sử dụng ajax để không reload này là làm tạm
                location.reload();
            } else {
                alert("Đã xảy ra lỗi! Thêm nhân viên không thành công: " + response.message);
                console.error(response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Có lỗi xảy ra trong quá trình gửi yêu cầu:", error);
        }
    });
}
//kiểm tra dữ liệu khi thêm 
function CheckDataNhanVien() {
    // Đặt biến để kiểm tra hợp lệ
    let isValid = true;

    // Reset các thông báo lỗi trước khi kiểm tra
    document.querySelectorAll('.error').forEach(function (el) {
        el.textContent = '';
    });

    // Biểu thức chính quy để kiểm tra ký tự đặc biệt
    const specialCharPattern = /[!@@#$%^&*(),.?":{}|<>]/;

    // Kiểm tra Họ và Tên
    const fullname = document.getElementById('fullNameNhanVien').value.trim();
    if (fullname === '') {
        document.getElementById('fullnameError').textContent = 'Họ và Tên không được để trống';
        isValid = false;
    } else if (specialCharPattern.test(fullname)) {
        document.getElementById('fullnameError').textContent = 'Họ và Tên không được chứa ký tự đặc biệt';
        isValid = false;
    }

    // Kiểm tra Giới tính
    const gender = document.getElementById('genderNhanVien').value;
    if (gender === '') {
        document.getElementById('genderError').textContent = 'Vui lòng chọn giới tính';
        isValid = false;
    }

    // Kiểm tra Căn cước công dân (CCCD)
    const cccd = document.getElementById('cccdNhanVien').value.trim();
    if (cccd === '') {
        document.getElementById('cccdError').textContent = 'Căn cước công dân không được để trống';
        isValid = false;
    } else if (!/^\d{12}$/.test(cccd)) {
        document.getElementById('cccdError').textContent = 'Căn cước công dân phải gồm 12 chữ số';
        isValid = false;
    }

    // Kiểm tra Số điện thoại
    const phone = document.getElementById('phoneNhanVien').value.trim();
    if (phone === '') {
        document.getElementById('phoneError').textContent = 'Số điện thoại không được để trống';
        isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
        document.getElementById('phoneError').textContent = 'Số điện thoại phải gồm 10 chữ số';
        isValid = false;
    }

    // Kiểm tra Chức vụ
    const position = document.getElementById('positionNhanVien').value;
    if (position === '') {
        document.getElementById('positionError').textContent = 'Vui lòng chọn chức vụ';
        isValid = false;
    }

    // Kiểm tra Địa chỉ
    const address = document.getElementById('addressNhanVien').value.trim();
    if (address === '') {
        document.getElementById('addressError').textContent = 'Địa chỉ không được để trống';
        isValid = false;
    } else if (specialCharPattern.test(address)) {
        document.getElementById('addressError').textContent = 'Địa chỉ không được chứa ký tự đặc biệt';
        isValid = false;
    }

    //kiểm tra lương cơ bản
    const luongCoBan = document.getElementById('LuongCoBanNhanVien').value.trim();
    if (luongCoBan === '' || luongCoBan < 0) {
        document.getElementById('LuongCoBanError').textContent = 'Lương cơ bản không hợp lệ';
        isValid = false;
    }
    // Kiểm tra Ảnh
    // const imageInput = document.getElementById('AddimageInputNhanVien');
    // if (imageInput.files.length === 0) {
    //     document.getElementById('imageError').textContent = 'Vui lòng chọn ảnh';
    //     isValid = false;
    // }

    //Nếu tất cả các trường đều hợp lệ, tiếp tục xử lý
    if (isValid) {
        //Thực hiện các hành động tiếp theo, ví dụ như gửi form hoặc gọi API
        InsertNhanVien();
    } else {
        console.log('Có lỗi trong dữ liệu nhập vào.');
    }


    // Xóa khoảng trắng cho các trường
    document.getElementById('cccdNhanVien').addEventListener('input', function () {
        this.value = this.value.replace(/^\s+|\s+$/g, '');
    });

    document.getElementById('phoneNhanVien').addEventListener('input', function () {
        this.value = this.value.replace(/^\s+|\s+$/g, '');
    });
};

