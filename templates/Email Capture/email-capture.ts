export class StyleField {
  label: string;
  className: string;
}

export class FonsecaEmailCapture implements CampaignTemplateComponent {
  @title("Sign Up Message")
  msg: string = "Sign up for our newsletter:";

  @title("Email Input Placeholder")
  emailPlaceholder: string = "Email";

  @title("Error Message")
  errorMsg: string = "Enter a valid email address";

  @title("CTA Text")
  ctaText: string = "Call To Action";

  run(context: CampaignComponentContext) {
    return {};
  }
}
