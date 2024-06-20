let gmail = require("../../../utils/gmailApi");
describe("Android Finding Elements", () => {
  it("Finding Elements by Accesibility ID", async () => {
    //Khai báo selector
    const SIGNUP_NOW = "~Đăng ký ngay";
    const EMAIL_TXT_FIELD =
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText";
    // const EMAIL_TXT_FIELD = "//android.widget.EditText[@hint='Nhập email']";
    const SIGN_UP_BUTTON = "~ĐĂNG KÝ";

    const OTP_FIELD =
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText";

    //Tiến hành đăng ký

    //1. Nhấn vào trang đăng ký
    const signup_now = await $(SIGNUP_NOW);
    await signup_now.click();
    //2. Nhập email
    const signup_email = await $(EMAIL_TXT_FIELD);
    await signup_email.click();
    await signup_email.setValue("aksdhfkajshdfkja25789@gmail.com");
    //3. Nhấn vào nút đăng ký
    const signup_button = await $(SIGN_UP_BUTTON);
    // const canclick = await signup_button.isClickable();
    await signup_button.click();
    // Thêm khoảng thời gian chờ trước khi lấy OTP
    await browser.pause(5000); // chờ 5 giây (5000 mili giây)
    //3. Nhập otp vào nút đăng ký
    const otp_field = await $(OTP_FIELD);
    await otp_field.click();
    const otpCode = await gmail.getOTP("from:noreply@appthanhnienvietnam.vn");
    await otp_field.setValue(otpCode);
  });
});
