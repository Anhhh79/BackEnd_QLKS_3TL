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