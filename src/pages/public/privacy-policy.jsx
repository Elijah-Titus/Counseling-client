import { Link } from "react-router-dom";
import LegalDocument from "../../components/common/legal-document";

const sections = [
  {
    title: "About this policy",
    content: (
      <p>
        This Privacy Policy explains how MindWell handles information when you
        use this website and its counseling services. It applies to information
        you provide through the site and information created as you use features
        such as appointments, messages, and testimonials.
      </p>
    ),
  },
  {
    title: "Information we handle",
    content: (
      <>
        <p>Depending on how you use the service, this may include:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Account information, such as your name, email address, and sign-in
            credentials.
          </li>
          <li>
            Appointment information, including scheduling details, the topic or
            description you submit, and related appointment status.
          </li>
          <li>
            Messages exchanged through the service and information you choose
            to include in them.
          </li>
          <li>
            Ratings and testimonials you submit. Testimonials may be shown
            publicly on the site.
          </li>
          <li>
            Basic information needed to operate and protect the service, which
            may be processed by the systems used to host and deliver it.
          </li>
        </ul>
        <p>
          The site uses browser session storage for sign-in session information
          and local storage for a display preference. These items help the site
          work and do not, by themselves, describe your counseling history.
        </p>
      </>
    ),
  },
  {
    title: "How information is used",
    content: (
      <>
        <p>Information is used as reasonably necessary to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Create and manage accounts and authenticate users.</li>
          <li>Arrange appointments and support communication with counselors.</li>
          <li>Respond to service requests and provide service-related updates.</li>
          <li>Display testimonials you choose to publish.</li>
          <li>Maintain, troubleshoot, and protect the service.</li>
          <li>Meet legal obligations and address safety or misuse concerns.</li>
        </ul>
      </>
    ),
  },
  {
    title: "When information may be shared",
    content: (
      <>
        <p>
          Information may be available to the counselor assigned to your
          appointment and to authorized personnel who need it to operate the
          service. It may also be processed by service providers supporting
          hosting, communications, or other essential operations, subject to
          their role and applicable safeguards.
        </p>
        <p>
          We may disclose information when required by law, to protect the
          rights or safety of people, or in connection with a business
          reorganization or transfer, where permitted by law. We do not sell
          your personal information.
        </p>
        <p>
          If you follow a meeting link, you will use a third-party service. That
          provider handles information under its own privacy terms and policies.
        </p>
      </>
    ),
  },
  {
    title: "Sensitive information and your choices",
    content: (
      <p>
        Appointment topics and messages may contain sensitive personal
        information. Please share only what is needed to receive the service.
        You can choose whether to submit a testimonial; if you do, its content
        may be publicly displayed. Do not include information in a testimonial
        that you do not want others to see.
      </p>
    ),
  },
  {
    title: "Retention and security",
    content: (
      <p>
        Information is kept for as long as reasonably needed to provide and
        maintain the service, meet applicable legal obligations, resolve
        disputes, and enforce agreements. Retention periods may differ by
        information type and applicable requirements. Reasonable safeguards are
        used to protect information, but no website or method of transmission
        can be guaranteed completely secure.
      </p>
    ),
  },
  {
    title: "Your privacy rights",
    content: (
      <p>
        Depending on where you live, you may have rights to access, correct,
        delete, or restrict certain personal information, or to object to some
        processing. You may also be able to update account information or manage
        a testimonial through the service. To make another privacy request,
        contact MindWell through the contact channel provided by the service.
        We may need to verify your identity before responding.
      </p>
    ),
  },
  {
    title: "Children and changes to this policy",
    content: (
      <>
        <p>
          The service is not intended for anyone who is not legally able to
          agree to its terms without appropriate consent. If you believe a
          child has provided personal information improperly, contact MindWell
          through the service.
        </p>
        <p>
          This policy may be updated from time to time. The date at the top
          indicates when it was last revised. Continued use after an update is
          subject to the revised policy, as permitted by applicable law.
        </p>
        <p>
          For the rules governing your use of the service, read our{" "}
          <Link to="/terms" className="font-semibold text-indigo-600 hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="How MindWell handles information when you use our counseling service."
      sections={sections}
    />
  );
}
