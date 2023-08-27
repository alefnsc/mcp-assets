(function () {
  /**
   * Validates the submitted email address and triggers appropriate actions.
   */
  function validateEmail() {
    // Attach a click event listener to the email submit button within the email capture section.
    Evergage.cashDom("#email-capture .fnsc-email-submit").on("click", () => {
      // Get the email address entered in the input field.
      const emailAddress = Evergage.cashDom(
        ".fnsc-email-form input[type='email']"
      ).val();
      // Regular expression pattern to validate email format.
      const regex = RegExp(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/
      );
      // If the email address is valid, send events to Evergage and SalesforceInteractions.
      if (emailAddress && regex.test(emailAddress)) {
        Evergage.sendEvent({
          action: {
            name: "Email Newsletter",
          },
          user: {
            attributes: {
              emailAddress: emailAddress,
            },
          },
        });
        SalesforceInteractions.sendEvent({
          interaction: {
            name: "Email Newsletter",
          },
          user: {
            attributes: {
              emailAddress: emailAddress,
            },
          },
        });
      } else {
        // If the email address is invalid, display an error message.
        Evergage.cashDom(".fnsc-error-msg")
          .removeClass("fnsc-hide")
          .addClass("fnsc-error");
      }
    });
  }

  function apply(context, template) {
    const contentZoneSelector = Evergage.getContentZoneSelector(
      context.contentZone
    );
    /**
     * The pageElementLoaded method waits for the content zone to load into the DOM
     * before rendering the template. The observer element that monitors for the content
     * zone element to get inserted into its DOM node is set to "body" by default.
     * For performance optimization, this default can be overridden by adding
     * a second selector argument, which will be used as the observer element instead.
     *
     * Visit the Template Display Utilities documentation to learn more:
     * https://developer.salesforce.com/docs/marketing/personalization/guide/web-template-display-utilities.html
     */
    return Evergage.DisplayUtils.pageElementLoaded(contentZoneSelector).then(
      (element) => {
        const html = template(context);
        Evergage.cashDom(element).html(html);
        validateEmail();
      }
    );
  }

  function reset(context, template) {
    /** Remove the template from the DOM to reset the template. */
    Evergage.cashDom("#evg-new-template").remove();
  }

  function control(context) {
    /**
     * Add Evergage data attributes to elements you wish to track in the control experience.
     *
     * Visit the Campaign Stats Tracking documentation to learn more:
     * https://developer.salesforce.com/docs/marketing/personalization/guide/campaign-stats-tracking.html
     */
    const contentZoneSelector = Evergage.getContentZoneSelector(
      context.contentZone
    );
    return Evergage.DisplayUtils.pageElementLoaded(contentZoneSelector).then(
      (element) => {
        Evergage.cashDom(element).attr({
          "data-evg-campaign-id": context.campaign,
          "data-evg-experience-id": context.experience,
          "data-evg-user-group": context.userGroup,
        });
      }
    );
  }

  registerTemplate({
    apply: apply,
    reset: reset,
    control: control,
  });
})();
