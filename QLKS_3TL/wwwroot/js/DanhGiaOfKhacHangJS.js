$(document).ready(function () {
    HienThiDanhGia();
    ThongKeDanhGia();
});
// <!-- danh gia -->
// <!-- xoa du lieu -->
function clearDataAssessInput() {
    const inputFields = document.getElementsByClassName('Assess');
    Array.from(inputFields).forEach((input) => {
        input.value = '';
    });
}
// <!-- xoa so sao -->
function clearStarAssess() {
    const radioOptions = document.getElementsByClassName('star');
    Array.from(radioOptions).forEach((radio) => {
        radio.checked = false;
    });
}

//ham xoa so dien thoại danh gia
function clearPhoneNumberDanhGia() {
    const NumberInput = document.getElementById('PhoneNumberAssess');
    NumberInput.value = '';
}
//Kiem tra nhap thong tin trong chuc nang danh gia

function validateAssessmentForm() {
    // Lấy giá trị của họ tên
    const fullName = document.getElementById('fullNameAssess').value.trim();
    const fullNameError = document.getElementById('fullNameError'); // Phần tử thông báo lỗi cho họ tên

    // Lấy giá trị của số điện thoại
    const phoneNumber = document.getElementById('PhoneNumberAssess').value.trim();
    const phoneNumberError = document.getElementById('phoneNumberError'); // Phần tử thông báo lỗi cho số điện thoại

    // Kiểm tra xem có radio nào được chọn cho phần đánh giá sao hay không
    const starRating = document.querySelector('input[name="rating"]:checked');
    const starRatingError = document.getElementById('starRatingError'); // Phần tử thông báo lỗi cho đánh giá sao

    // Biểu thức chính quy để kiểm tra số điện thoại (10 chữ số)
    const phoneRegex = /^[0-9]{10}$/;

    // Reset các thông báo lỗi trước khi kiểm tra
    fullNameError.textContent = '';
    phoneNumberError.textContent = '';
    starRatingError.textContent = '';

    // Biến cờ để theo dõi trạng thái hợp lệ của form
    let isValid = true;

    // Kiểm tra xem họ tên đã được nhập chưa
    if (fullName === "") {
        fullNameError.textContent = "Vui lòng nhập họ tên của bạn.";
        isValid = false;
    }
    // Kiểm tra xem số điện thoại đã được nhập và hợp lệ chưa
    if (phoneNumber === "" || !phoneRegex.test(phoneNumber)) {
        phoneNumberError.textContent = "Vui lòng nhập số điện thoại hợp lệ (10 chữ số).";
        isValid = false;
    }

    // Kiểm tra xem người dùng có chọn số sao hay chưa
    if (!starRating) {
        starRatingError.textContent = "Vui lòng chọn số sao để đánh giá khách sạn.";
        isValid = false;
    }

    // Nếu có lỗi, không tiếp tục thực hiện
    if (!isValid) {
        return false;
    }

    ThemDanhGia();
    return true;
}


// Thêm sự kiện focus để ẩn thông báo lỗi khi nhấp vào ô nhập
document.getElementById('fullNameAssess').addEventListener('focus', function () {
    document.getElementById('fullNameError').textContent = '';
});

document.getElementById('PhoneNumberAssess').addEventListener('focus', function () {
    document.getElementById('phoneNumberError').textContent = '';
});

const starInputs = document.querySelectorAll('input[name="rating"]');
starInputs.forEach(function (input) {
    input.addEventListener('change', function () {
        document.getElementById('starRatingError').textContent = '';
    });
});

//Thống kê đánh giá
function ThongKeDanhGia() {
    // Đường dẫn đến phương thức trong controller để lấy thông tin
    const baseUrl = '/KhachHang/DanhGia/GetSoLieuDanhGia';
    $.ajax({
        url: baseUrl,  // Tạo URL
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            if (response.success) {
                // Gán giá trị vào các phần tử dựa trên ID
                $('#totalReviews').text(response.total || 0);
                $('#totalReviews2').text(response.total || 0);
                $('#averageRating').text(response.average || 0);
                $('#fiveStarCount').text(response.sum5sao || 0);
                $('#fourStarCount').text(response.sum4sao || 0);
                $('#threeStarCount').text(response.sum3sao || 0);
                $('#twoStarCount').text(response.sum2sao || 0);
                $('#oneStarCount').text(response.sum1sao || 0);
                // tô màu sao
                const stars = document.querySelectorAll(".star-rating2 i");
                stars.forEach(star => {
                    const starValue = parseFloat(star.getAttribute("data-value"));
                    if (starValue <= Math.floor(response.average)) {
                        star.classList.add("filled");
                    } else if (starValue === Math.ceil(response.average)) {
                        const percentage = (response.average - Math.floor(response.average)) * 100;
                        star.style.background = `linear-gradient(90deg, #ffc107 ${percentage}%, #ddd ${percentage}%)`;
                        star.style.webkitBackgroundClip = "text";
                        star.style.color = "transparent";
                    }
                });
            } else {
                console.error('Phản hồi không thành công:', response.message);
                alert('Không thể lấy thông tin đánh giá. Vui lòng thử lại.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin đánh giá:', textStatus, errorThrown);
            alert('Không thể lấy thông tin đánh giá. Vui lòng kiểm tra lại.');
        }
    });
}
//hiển thị đánh giá 
function HienThiDanhGia() {
    // Đường dẫn đến phương thức trong controller để lấy thông tin
    const baseUrl = '/KhachHang/DanhGia/GetDanhGia';
    $.ajax({
        url: baseUrl,  // Tạo URL
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            // Kiểm tra xem phản hồi có thành công không và có chứa dữ liệu không
            if (!response.success || !response.data || response.data.length === 0) {
                let object = '<div><p class="text-center">Không có đánh giá nào để hiển thị</p></div>';
                $('#bodyDanhGia').html(object);
            } else {
                let object = '';
                $.each(response.data, function (index, item) {
                    object += `
                    <div>
                            <p><b>${item.hoTen} : </b><b><span class="text-warning">${item.soSao} sao</span></b></p>
                            <p class="text-break">
                                Đánh giá: "${item.noiDung}"
                            </p>
                            <p class="text-muted" style="font-size: 0.9rem;">Thời gian: ${item.thoiGian}</p>
                            <hr style="border: none;border-top: 1px dashed #ccc;">
                        </div>
                    `;
                });
                $('#bodyDanhGia').html(object);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin đánh giá:', textStatus, errorThrown);
            alert('Không thể lấy thông tin đánh giá. Vui lòng kiểm tra lại.');
        }
    });
}

//thêm tài khoản
// Hàm Insert để thêm đánh giá
function ThemDanhGia() {
    var HoTen = $('#fullNameAssess').val().trim();
    var SoDienThoai = $('#PhoneNumberAssess').val().trim();
    var NoiDung = $('#ContentAssess').val().trim();
    var SoSao = 0;

    // Kiểm tra từ trên xuống và dừng khi tìm thấy ngôi sao được chọn
    for (let i = 5; i >= 1; i--) { // Bắt đầu từ 5 sao xuống 1 sao
        if ($(`#star${i}`).is(':checked')) {
            SoSao = i;
            break; // Dừng ngay khi tìm thấy sao được chọn
        }
    }
    if (!NoiDung) {
        NoiDung = "Chưa đánh giá";
    }
    var data =
    {
        hoTen: HoTen,
        soDienThoai: SoDienThoai,
        noiDung: NoiDung,  // Hoặc tên tài khoản nếu có
        soSao: SoSao
    }
    // Gửi yêu cầu AJAX
    $.ajax({
        url: '/KhachHang/DanhGia/ThemDanhGia', // Đổi URL này thành URL của bạn
        type: 'POST',
        contentType: 'application/json', // Đảm bảo dữ liệu được gửi dưới dạng JSON
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success) {
                alert("Cảm ơn bạn đã đánh giá!");
                $('#modalDanhGia').modal('hide'); // Ẩn modal sau khi thêm thành công
                ThongKeDanhGia();
                HienThiDanhGia();
                clearDataAssessInput();
                clearStarAssess();
            } else {
                // Lấy giá trị của số điện thoại
                const phoneNumber = document.getElementById('PhoneNumberAssess').value.trim();
                const phoneNumberError = document.getElementById('phoneNumberError'); // Phần tử thông báo lỗi cho số điện thoại
                phoneNumberError.textContent = response.message;
                console.error("Lỗi:", response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            alert("Đã xảy ra lỗi khi thêm đánh giá. Vui lòng thử lại.");
        }
    });
}