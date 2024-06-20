let gmail = require("../../../utils/gmailApi");
let file = require("../../../utils/file");
describe("Android Finding Elements", () => {
  it("Finding Elements by Accesibility ID", async () => {
    //Khai báo selector
    const SIGNUP_NOW = "~Đăng ký ngay";
    const EMAIL_TXT_FIELD =
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText";

    const EMAIL_SCREEN =
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ScrollView";
    // const EMAIL_TXT_FIELD = "//android.widget.EditText[@hint='Nhập email']";
    const SIGN_UP_BUTTON = "~ĐĂNG KÝ";

    const OTP_FIELD =
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText";
    //

    const PASSWORD_TXT_FIELD =
      "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText";
    const DONE_BUTTON = "~HOÀN THÀNH ĐĂNG KÝ";
    //Đọc email từ file
    const emails = await file.getEmailFromCSV();
    console.log(emails);
    //Tiến hành đăng ký
    for (let email of emails) {
      //1. Nhấn vào trang đăng ký
      const signup_now = await $(SIGNUP_NOW);
      await signup_now.click();
      //2. Nhập email
      const signup_email = await $(EMAIL_TXT_FIELD);
      await signup_email.click();
      console.log(email);
      await signup_email.setValue(email);
      const email_screen = await $(EMAIL_SCREEN);
      await email_screen.click();
      //3. Nhấn vào nút đăng ký
      const signup_button = await $(SIGN_UP_BUTTON);
      // const canclick = await signup_button.isClickable();
      await signup_button.click();
      //3. Nhập otp vào nút đăng ký
      const otp_field = await $(OTP_FIELD);
      await otp_field.click();
      // Thêm khoảng thời gian chờ trước khi lấy OTP
      await browser.pause(10000); // chờ 5 giây (5000 mili giây)
      const otpCode = await gmail.getOTP("from:noreply@appthanhnienvietnam.vn");
      await otp_field.setValue(otpCode);
      //4. Nhập mật khẩu và hoàn thành
      const password_field = await $(PASSWORD_TXT_FIELD);
      await password_field.click();
      const password = email.split("@")[0];
      await password_field.setValue(password);
      //5. Ghi lại tài khoản và mật khẩu
      console.log({ email: email, password: password });
      await file.writeAccountsToCSV([{ email: email, password: password }]);
    }
  });
});
