import { Link } from "react-router-dom";
import LegalDocument from "../../components/common/legal-document";

const sections = [
  {
    title: "Agreement to these terms",
    content: (
      <p>
        These Terms of Service apply when you access or use the MindWell
        website, account, appointment, messaging, and related counseling
        features (the “Service”). By creating an account or using the Service,
        you agree to these terms. If you do not agree, do not use the Service.
      </p>
    ),
  },
  {
    title: "Accounts and responsible use",
    content: (
      <>
        <p>
          Provide accurate account information, keep your sign-in credentials
          private, and promptly tell MindWell through the available service
          contact channel if you suspect unauthorized use of your account. You
          are responsible for activity carried out through your account, except
          where applicable law provides otherwise.
        </p>
        <p>
          Use the Service lawfully and respectfully. Do not impersonate another
          person, interfere with the Service, attempt to access another user’s
          account or information, or use the Service to harass, threaten, or
          harm anyone.
        </p>
      </>
    ),
  },
  {
    title: "Counseling and emergencies",
    content: (
      <>
        <p>
          The Service helps users arrange and participate in counseling. It is
          not an emergency service and is not monitored continuously. Messages
          may not be read or answered immediately, and the Service should not
          be relied on for urgent help.
        </p>
        <p>
          If you or someone else is in immediate danger, contact your local
          emergency services or an appropriate crisis support service. Online
          counseling and messaging are not a substitute for emergency care.
          Counseling outcomes vary and cannot be guaranteed.
        </p>
      </>
    ),
  },
  {
    title: "Appointments and third-party services",
    content: (
      <p>
        Appointment availability, scheduling, cancellation, and rescheduling
        are managed through the Service and are subject to the options and
        information shown there. Video sessions may use a third-party meeting
        provider. That provider’s own terms and privacy practices apply when
        you use its service.
      </p>
    ),
  },
  {
    title: "Your content",
    content: (
      <>
        <p>
          You retain rights you have in information and content you submit.
          You give MindWell permission to use, store, and display that content
          as needed to provide the Service and, for testimonials you submit for
          publication, to display them on the site. Do not submit content that
          you do not have the right to share.
        </p>
        <p>
          You are responsible for the content you submit. Do not post private
          information about another person without permission. A testimonial
          intended for publication should not include sensitive information you
          do not want made public.
        </p>
      </>
    ),
  },
  {
    title: "Service availability and changes",
    content: (
      <p>
        We may update, suspend, or discontinue parts of the Service to maintain
        or improve it, address security or operational issues, or comply with
        law. We aim to keep the Service available but do not promise
        uninterrupted access. We may restrict or suspend an account when
        reasonably necessary to protect users, the Service, or comply with law.
      </p>
    ),
  },
  {
    title: "Privacy",
    content: (
      <p>
        Our{" "}
        <Link
          to="/privacy-policy"
          className="font-semibold text-indigo-600 hover:underline"
        >
          Privacy Policy
        </Link>{" "}
        explains how information is handled when you use the Service. Please
        review it before creating an account or sharing personal information.
      </p>
    ),
  },
  {
    title: "Disclaimer and liability",
    content: (
      <p>
        To the extent permitted by law, the Service is provided on an
        “as available” basis. Nothing in these terms excludes or limits a
        responsibility or right that cannot legally be excluded or limited.
        Subject to that, MindWell is not responsible for indirect or
        consequential loss arising from your use of the Service.
      </p>
    ),
  },
  {
    title: "Changes and contact",
    content: (
      <p>
        These terms may be revised from time to time, with the updated date
        shown above. Continued use after a revision takes effect means you
        accept the revised terms, where permitted by law. If you have a
        question about these terms, contact MindWell through the contact
        channel provided by the Service.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalDocument
      title="Terms of Service"
      intro="The terms that apply when you use MindWell and its counseling services."
      sections={sections}
    />
  );
}
