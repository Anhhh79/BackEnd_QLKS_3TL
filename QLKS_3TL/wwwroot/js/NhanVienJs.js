$(document).ready(function () {
    // Hiển thị modal thêm nhân viên
    $('#btnThemNhanVien').on('click', function () {
        $('#ModalThemNhanVien').modal('show');
    });

    //Tìm kiếm nhân viên
    $('#timKiemNhanVien').on('input', function () {
        var query = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
        $('#tblBodyNhanVien tr').each(function () {
            var rowText = $(this).text().toLowerCase(); // Lấy toàn bộ văn bản của một dòng
            if (rowText.includes(query)) {  // Nếu dòng chứa chuỗi tìm kiếm
                $(this).show();  // Hiển thị dòng
            } else {
                $(this).hide();  // Ẩn dòng
            }
        });
    });

    // Xóa khoảng trắng cho các trường khi thêm
    $('#cccdNhanVien').on('input', function () {
        $(this).val($(this).val().replace(/^\s+|\s+$/g, ''));
    });

    $('#phoneNhanVien').on('input', function () {
        $(this).val($(this).val().replace(/^\s+|\s+$/g, ''));
    });

    // Xóa khoảng trắng trong các ô CCCD và SĐT khi sửa
    $('#editCCCD').on('input', function () {
        $(this).val($(this).val().replace(/^\s+|\s+$/g, ''));
    });

    $('#editPhone').on('input', function () {
        $(this).val($(this).val().replace(/^\s+|\s+$/g, ''));
    });
});


//load thông tin nhân viên
function LoadNhanVien() {
    // Đường dẫn đến phương thức trong controller để lấy thông tin
    const baseUrl = '/QuanLy/QuanLyNhanVien/LoadNhanViens';
    $.ajax({
        url: baseUrl,  // Tạo URL
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            // Kiểm tra xem phản hồi có thành công không và có chứa dữ liệu không
            if (!response.success || !response.data || response.data.length === 0) {
                let object = '<tr><td colspan="8" class="text-center">Không có nhân viên nào để hiển thị</td></tr>';
                $('#tblBodyNhanVien').html(object);
            } else {
                let soThuTu = 1;
                let object = '';
                $.each(response.data, function (index, item) {
                    object += `
                    <tr class="row-item">
                        <th scope="row">${soThuTu++}</th>
                        <td class="me-2">${item.cccd}</td>
                        <td>${item.hoTen}</td>
                        <td>${item.gioiTinh}</td>
                        <td>${item.soDienThoai}</td>
                        <td>${item.chucVu}</td>
                        <td>${item.diaChi}</td>
                        <td class="d-flex justify-content-end">
                            <a class="cursor me-2 mt-1" onclick="ChiTietNhanVien('${item.maNhanVien}')"
                                style="color: darkblue; font-style: italic; text-decoration: underline;">
                                Chi tiết
                            </a>
                            <button type="button" class="btn btn-warning me-2 edit-btn" onclick="LoadModalUpdate('${item.maNhanVien}')"
                                style="font-size: small;">
                                Sửa
                            </button>
                            <button type="button" class="btn btn-danger" onclick="DeleteNhanVien('${item.maNhanVien}')" style="font-size: small;">
                                Xóa
                            </button>
                        </td>
                    </tr>`;
                });
                $('#tblBodyNhanVien').html(object);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin nhân viên:', textStatus, errorThrown);
            alert('Không thể lấy thông tin nhân viên. Vui lòng kiểm tra lại.');
        }
    });
}

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

//Thêm thông tin nhân viên
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
                LoadNhanVien();
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
    return isValid;
};

//sửa thông tin nhân viên
//đưa dữ liệu lên modal
function LoadModalUpdate(employeeId) {
    // Đường dẫn đến phương thức trong controller để lấy thông tin nhân viên
    const baseUrl = `/QuanLy/QuanLyNhanVien/ChiTietNhanVien/`;

    $.ajax({
        url: baseUrl + employeeId,
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        success: function (response) {
            // Giả sử response chứa dữ liệu của nhân viên dưới dạng object
            const employeeData = response.data;

            // Gán dữ liệu vào các ô trong modal
            $('#editMaNhanVien').val(employeeData.maNhanVien)
            $('#editFullname').val(employeeData.hoTen);    // Họ và Tên
            $('#editGender').val(employeeData.gioiTinh);        // Giới tính
            $('#editCCCD').val(employeeData.cccd);            // Căn cước công dân
            $('#editPhone').val(employeeData.soDienThoai);          // Số điện thoại
            $('#editPosition').val(employeeData.chucVu);    // Chức vụ
            $('#editAddress').val(employeeData.diaChi);      // Địa chỉ
            $('#editLuongCoBan').val(employeeData.luongCoBan);
            // Nếu cần thiết, bạn có thể hiển thị modal ở đây
            $('#modalUpdateNhanVien').modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin nhân viên:', textStatus, errorThrown);
            alert('Không thể lấy thông tin nhân viên. Vui lòng kiểm tra lại.');
        }
    });
}
//cập nhật thông tin nhân viên
function UpdateNhanVien() {
    const formData = new FormData();
    formData.append('maNhanVien', $('#editMaNhanVien').val());
    formData.append('hoTen', $('#editFullname').val());
    formData.append('gioiTinh', $('#editGender').val());
    formData.append('cccd', $('#editCCCD').val());
    formData.append('soDienThoai', $('#editPhone').val());
    formData.append('chucVu', $('#editPosition').val());
    formData.append('diaChi', $('#editAddress').val());
    formData.append('luongCoBan', $('#editLuongCoBan').val());

    // Lấy file ảnh nếu có
    const fileInput = $('#editAnhNhanVien')[0];
    if (fileInput && fileInput.files.length > 0) {
        formData.append('AnhNhanVien', fileInput.files[0]);
    }

    $.ajax({
        url: '/QuanLy/QuanLyNhanVien/Update',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                alert(response.message); // Hiển thị thông báo thành công
                $('#modalUpdateNhanVien').modal('hide'); // Đóng modal

                // Gọi hàm để làm mới danh sách nhân viên
                LoadNhanVien();
            } else {
                alert(response.message); // Hiển thị thông báo lỗi từ server
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi cập nhật nhân viên:', textStatus, errorThrown);
            alert('Không thể cập nhật thông tin nhân viên. Vui lòng thử lại.');
        }
    });
}
//kiểm tra dữ liệu khi sửa 
function CheckDataEditNhanVien() {
    // Đặt biến để kiểm tra hợp lệ
    let isValid = true;

    // Reset các thông báo lỗi trước khi kiểm tra
    document.querySelectorAll('.error').forEach(function (el) {
        el.textContent = '';
    });

    // Biểu thức chính quy để kiểm tra ký tự đặc biệt
    const specialCharPattern = /[!@@#$%^&*(),.?":{}|<>]/;

    // Kiểm tra Họ và Tên
    const fullname = document.getElementById('editFullname').value.trim();
    if (fullname === '') {
        document.getElementById('EditNameError').textContent = 'Họ và Tên không được để trống';
        isValid = false;
    } else if (specialCharPattern.test(fullname)) {
        document.getElementById('EditNameError').textContent = 'Họ và Tên không được chứa ký tự đặc biệt';
        isValid = false;
    }

    // Kiểm tra Giới tính
    const gender = document.getElementById('editGender').value;
    if (gender === '') {
        document.getElementById('EditgenderError').textContent = 'Vui lòng chọn giới tính';
        isValid = false;
    }

    // Kiểm tra Căn cước công dân (CCCD)
    const cccd = document.getElementById('editCCCD').value.trim();
    if (cccd === '') {
        document.getElementById('EditcccdError').textContent = 'Căn cước công dân không được để trống';
        isValid = false;
    } else if (!/^\d{12}$/.test(cccd)) {
        document.getElementById('EditcccdError').textContent = 'Căn cước công dân phải gồm 12 chữ số';
        isValid = false;
    }

    // Kiểm tra Số điện thoại
    const phone = document.getElementById('editPhone').value.trim();
    if (phone === '') {
        document.getElementById('EditphoneError').textContent = 'Số điện thoại không được để trống';
        isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
        document.getElementById('EditphoneError').textContent = 'Số điện thoại phải gồm 10 chữ số';
        isValid = false;
    }

    // Kiểm tra Chức vụ
    const position = document.getElementById('editPosition').value;
    if (position === '') {
        document.getElementById('EditpositionError').textContent = 'Vui lòng chọn chức vụ';
        isValid = false;
    }

    // Kiểm tra Địa chỉ
    const address = document.getElementById('editAddress').value.trim();
    if (address === '') {
        document.getElementById('EditaddressError').textContent = 'Địa chỉ không được để trống';
        isValid = false;
    } else if (specialCharPattern.test(address)) {
        document.getElementById('EditaddressError').textContent = 'Địa chỉ không được chứa ký tự đặc biệt';
        isValid = false;
    }

    //kiểm tra lương cơ bản
    const luongCoBan = document.getElementById('editLuongCoBan').value.trim();
    if (luongCoBan === '' || luongCoBan < 0) {
        document.getElementById('editLuongCoBanError').textContent = 'Lương cơ bản không hợp lệ';
        isValid = false;
    }

    // Kiểm tra Ảnh
    // const imageInput = document.getElementById('imageInput');
    // if (imageInput.files.length === 0) {
    //     document.getElementById('EditimageError').textContent = 'Vui lòng chọn ảnh';
    //     isValid = false;
    // }

    // Nếu tất cả các trường đều hợp lệ, tiếp tục xử lý
    if (isValid) {
        UpdateNhanVien();
    }
    else {
        console.log('Có lỗi trong dữ liệu nhập vào.');
    }
    //nếu dữ liệu hợp lý thì gọi hàm Update

    return isValid; // Ngăn form submit nếu có lỗi
}

//Xóa thông tin nhân viên
function DeleteNhanVien(maNhanVien) {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên có mã: " + maNhanVien + "?.")) {
        return;
    }

    const url = `/QuanLy/QuanLyNhanVien/Delete?maNhanVien=${maNhanVien}`;

    $.ajax({
        url: url,
        type: 'DELETE',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                LoadNhanVien();
                alert(response.message);
            } else {
                alert(response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Lỗi khi xóa nhân viên:", textStatus, errorThrown);
            alert("Không thể xóa nhân viên. Vui lòng thử lại.");
        }
    });
}


