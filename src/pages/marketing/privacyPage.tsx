import React from "react";
import "../../styles/privacy.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import FloatingTocNav from "../../components/core/FloatingTocNav";

const PRIVACY_SECTIONS = [
   { id: "introduction", label: "1. Introduction" },
   { id: "data-collection", label: "2. Data Collection" },
   { id: "data-usage", label: "3. Data Usage" },
   { id: "cookies-tracking", label: "4. Cookies & Tracking Technologies" },
   { id: "data-storage", label: "5. Data Storage & Retention" },
   { id: "third-party-services", label: "6. Third-Party Services" },
   { id: "international-transfers", label: "7. International Data Transfers" },
   { id: "childrens-privacy", label: "8. Children’s Privacy" },
   { id: "user-rights", label: "9. User Rights & Choices" },
   { id: "security-measures", label: "10. Security Measures" },
   { id: "changes-policy", label: "11. Changes to This Policy" },
   { id: "contact-info", label: "12. Contact Us" },
];

interface PrivacyPolicyPageProps {
   signedIn: boolean;
   toggleModal: () => void;
   user: any;
   handleSignOut: () => void;
   isModalOpen: boolean;
   theme: any;
   handleToggleTheme: () => void;
}

function PrivacyPolicyPage({
   signedIn,
   toggleModal,
   user,
   handleSignOut,
   isModalOpen,
   theme,
   handleToggleTheme,
}: PrivacyPolicyPageProps) {
   return (
      <React.Fragment>
         <Nav
            signedIn={signedIn}
            toggleModal={toggleModal}
            user={user}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            home={true}
            navOpen={false}
            setNavOpen={null}
         />

         <FloatingTocNav sections={PRIVACY_SECTIONS} />

         <div className="privacy-container">
            <nav className="privacy-nav">
               <h1>Fulcrums Privacy Policy</h1>
               <ul>
                  <li>
                     <a href="#introduction">1. Introduction</a>
                  </li>
                  <li>
                     <a href="#data-collection">2. Data Collection</a>
                  </li>
                  <li>
                     <a href="#data-usage">3. Data Usage</a>
                  </li>
                  <li>
                     <a href="#cookies-tracking">
                        4. Cookies &amp; Tracking Technologies
                     </a>
                  </li>
                  <li>
                     <a href="#data-storage">5. Data Storage &amp; Retention</a>
                  </li>
                  <li>
                     <a href="#third-party-services">6. Third-Party Services</a>
                  </li>
                  <li>
                     <a href="#international-transfers">
                        7. International Data Transfers
                     </a>
                  </li>
                  <li>
                     <a href="#childrens-privacy">8. Children’s Privacy</a>
                  </li>
                  <li>
                     <a href="#user-rights">9. User Rights &amp; Choices</a>
                  </li>
                  <li>
                     <a href="#security-measures">10. Security Measures</a>
                  </li>
                  <li>
                     <a href="#changes-policy">11. Changes to This Policy</a>
                  </li>
                  <li>
                     <a href="#contact-info">12. Contact Us</a>
                  </li>
               </ul>
            </nav>

            <main className="privacy-content">
               <section id="introduction">
                  <h2>1. Introduction</h2>
                  <p>
                     At Fulcrums, we hold your privacy in the highest regard and
                     dedicate substantial resources to safeguarding any personal
                     information collected about you. This Privacy Policy
                     (“Policy”) sets forth the manner in which Fulcrums (“we,”
                     “us,” or “our”) gathers, utilizes, disseminates, and
                     protects your personal data when you engage with our
                     website, applications, and related software (collectively,
                     the “Service”). By accessing or using our Service, you
                     expressly agree to be bound by this Policy and any
                     applicable Terms of Service.
                  </p>
                  <p>
                     We encourage you to read this Policy carefully to
                     understand our practices regarding the handling of your
                     personal data. If you have any questions about this Policy
                     or any privacy-related issues, please contact us using the
                     information provided in Section 12 (“Contact Us”). If you
                     do not agree with or accept any part of this Policy, please
                     discontinue your use of our Service immediately.
                  </p>
                  <p>
                     Our commitment to data privacy extends beyond mere
                     compliance with legal requirements. We continuously
                     evaluate our data protection methods to ensure that we
                     adhere to the most current industry standards. As
                     technology and regulatory landscapes evolve, Fulcrums may
                     refine or amend this Policy to maintain best practices in
                     privacy and data security. By continuing to use our Service
                     after any such modifications take effect, you reaffirm your
                     acceptance of the updated Privacy Policy.
                  </p>
               </section>

               <section id="data-collection">
                  <h2>2. Data Collection</h2>
                  <p>
                     We collect various forms of personal data from you through
                     multiple interactions with our Service. This data is
                     essential for delivering a seamless user experience,
                     maintaining accurate billing records, and ensuring
                     compliance with relevant legal obligations. The types of
                     personal data we may collect include, but are not limited
                     to:
                  </p>
                  <ul>
                     <li>
                        <strong>Personal Identifiers:</strong> Full name, email
                        address, phone number, and other contact details
                        necessary for account setup and customer support.
                     </li>
                     <li>
                        <strong>Account Credentials:</strong> Unique login
                        credentials (e.g., username and password) that allow
                        secure access to your user account.
                     </li>
                     <li>
                        <strong>Payment Information:</strong> Credit or debit
                        card details, billing addresses, and additional
                        financial data required for processing transactions in a
                        secure and compliant manner.
                     </li>
                     <li>
                        <strong>Device and Usage Information:</strong> IP
                        addresses, browser types, device identifiers, operating
                        systems, logs of page visits, and other technical data
                        that illustrate how you interact with our Service.
                     </li>
                     <li>
                        <strong>Communications Data:</strong> Content of emails,
                        chat messages, or other forms of communication you
                        initiate with our support team, which helps us address
                        your inquiries more effectively and improve our Service.
                     </li>
                  </ul>
                  <p>
                     We strive to collect only the personal data that is
                     necessary and relevant for the purposes outlined in this
                     Policy. Where required by law, we will obtain your explicit
                     consent before gathering particular categories of data,
                     especially if such data is considered sensitive under
                     applicable regulations. Providing complete and accurate
                     data ensures optimal functionality of the Service and
                     minimizes potential errors or service disruptions.
                  </p>
                  <p>
                     In some circumstances, we may also collect non-personal
                     data such as aggregated statistical information. This
                     anonymized data cannot be used to identify or contact you,
                     and is used primarily for analytics, improving user
                     experience, or deriving insights into platform usage
                     trends. Fulcrums reserves the right to store, analyze, and
                     utilize such non-personal, aggregated data without
                     restriction or prior notification.
                  </p>
               </section>

               <section id="data-usage">
                  <h2>3. Data Usage</h2>
                  <p>
                     The personal data we collect serves multiple legitimate and
                     essential purposes central to our operations. Specifically,
                     we use your data to:
                  </p>
                  <ol>
                     <li>
                        <strong>Operate and Provide the Service:</strong> This
                        includes creating and maintaining user accounts,
                        processing billing or subscription transactions,
                        troubleshooting technical issues, and ensuring the
                        Service is available, responsive, and user-friendly.
                     </li>
                     <li>
                        <strong>Enhance User Experience:</strong> We analyze
                        usage patterns, conduct performance tests, and utilize
                        feedback to refine our Service’s features and interface,
                        thereby optimizing our offerings to fit user needs more
                        effectively.
                     </li>
                     <li>
                        <strong>Marketing &amp; Communications:</strong> We may
                        occasionally send newsletters, product updates,
                        promotional materials, or special offers, unless you opt
                        out of such communications. We also employ aggregated or
                        de-identified data to study platform usage and inform
                        strategic business decisions.
                     </li>
                     <li>
                        <strong>Legal Compliance &amp; Enforcement:</strong> To
                        comply with legal requirements, address disputes, detect
                        and prevent fraudulent activity, and enforce our Terms
                        of Service or related agreements. This may involve
                        sharing data with law enforcement or regulatory bodies
                        when required by law or pursuant to a valid legal
                        request.
                     </li>
                  </ol>
                  <p>
                     Our data usage practices are guided by principles of
                     proportionality and necessity. Only those personnel or
                     third-party service providers with a legitimate need to
                     access your data for the above purposes will be granted
                     such access. We uphold this principle through internal
                     policies, contractual obligations, and periodic audits of
                     our data management processes.
                  </p>
                  <p>
                     Under no circumstances do we sell or rent your personal
                     data to third parties for direct monetary gain. However, we
                     may engage in partnerships or collaborations that require
                     us to share aggregated, anonymized data that does not
                     identify you personally. We believe in transparency about
                     such practices and ensure that your personal data remains
                     protected as per this Policy and applicable legal
                     requirements.
                  </p>
               </section>

               <section id="cookies-tracking">
                  <h2>4. Cookies &amp; Tracking Technologies</h2>
                  <p>
                     Fulcrums utilizes cookies, web beacons, and similar
                     tracking technologies (collectively, “Cookies”) to
                     understand user behavior, improve site navigation, and
                     gather relevant metrics about engagement and performance.
                     These Cookies enable us to recognize returning visitors and
                     store certain preferences, minimizing the repetitive input
                     of information.
                  </p>
                  <p>
                     By default, most web browsers accept Cookies. You can
                     modify your browser settings to disable or delete Cookies.
                     However, disabling certain Cookies may prevent you from
                     using some features or fully accessing the Service. By
                     continuing to use our Service without disabling Cookies,
                     you signify your acceptance of our Cookie practices as
                     described in this Policy.
                  </p>
                  <p>
                     Additionally, certain third-party service providers or
                     advertising networks may use their own Cookies or tracking
                     technologies when you interact with our Service. Fulcrums
                     does not control these third-party technologies and advises
                     you to review their respective privacy policies to
                     understand how they handle personal data and tracking.
                  </p>
                  <p>
                     We employ industry-standard safeguards and assessments to
                     ensure that any third-party Cookies on our platform do not
                     collect excessive or unnecessary data. Our objective is to
                     provide a user-centric experience where any data gathered
                     is strictly leveraged for legitimate and lawful purposes
                     that align with user expectations and regulatory standards.
                  </p>
               </section>

               <section id="data-storage">
                  <h2>5. Data Storage &amp; Retention</h2>
                  <p>
                     Personal data collected through our Service is stored on
                     secure servers equipped with encryption, firewalls, and
                     other advanced security measures to ward off unauthorized
                     access, disclosure, or misuse. While we make reasonable
                     efforts to protect your data, no system can be completely
                     free of vulnerabilities, and we cannot guarantee absolute
                     security.
                  </p>
                  <p>
                     We maintain your personal data only as long as necessary to
                     fulfill the purposes described in this Policy, or as
                     mandated by legal, accounting, or regulatory obligations.
                     In determining the appropriate retention period, we
                     consider factors such as data volume, sensitivity,
                     potential risks from unauthorized use or disclosure, and
                     whether alternative means could serve the same purpose.
                  </p>
                  <p>
                     In some cases, we may pseudonymize or anonymize your
                     personal data if retention is required for internal
                     research or statistical analysis beyond the original
                     retention period. Once anonymized, such data no longer
                     constitutes personal data under relevant privacy laws,
                     thereby permitting us to retain it indefinitely for
                     analytical purposes without further notice to you.
                  </p>
               </section>

               <section id="third-party-services">
                  <h2>6. Third-Party Services</h2>
                  <p>
                     We may engage third-party companies, consultants, or
                     individuals to facilitate or augment specific components of
                     our Service (“Service Providers”). These Service Providers
                     may be granted limited access to your personal data
                     strictly for the tasks assigned to them on our behalf and
                     are obligated to protect your data and refrain from using
                     it for any unauthorized purposes.
                  </p>
                  <p>
                     While our Service may provide links to external websites or
                     resources, Fulcrums does not endorse or assume
                     responsibility for the privacy practices or content found
                     on these external domains. We encourage users to be
                     vigilant about leaving our platform and to review the
                     privacy notices of any third-party site or service that may
                     collect personal data.
                  </p>
                  <p>
                     Any exchange of personal data between Fulcrums and external
                     service providers is governed by data protection
                     agreements, contractual clauses, or equivalent safeguards
                     aimed at maintaining confidentiality and integrity. In
                     scenarios where a third-party fails to uphold these
                     obligations, Fulcrums will take appropriate corrective
                     measures, potentially terminating the relationship and, if
                     required, reporting the incident to regulatory entities.
                  </p>
               </section>

               <section id="international-transfers">
                  <h2>7. International Data Transfers</h2>
                  <p>
                     Although Fulcrums primarily operates in Canada, we may
                     store, process, or transfer your personal data in various
                     regions or countries as operational needs dictate. The data
                     protection regulations in these jurisdictions may differ
                     from your own, but we will always handle your personal data
                     in accordance with this Policy.
                  </p>
                  <p>
                     When we transfer your personal data internationally, we
                     implement legally recognized transfer mechanisms such as
                     standard contractual clauses, Privacy Shield frameworks
                     (where applicable), or other certifications endorsed by
                     relevant authorities. These measures are designed to ensure
                     that your data receives a level of protection consistent
                     with the standards required in your jurisdiction.
                  </p>
                  <p>
                     You acknowledge that international transfers of personal
                     data carry inherent risks due to potential variations in
                     legal and regulatory frameworks. By using our Service or
                     otherwise submitting personal data to us, you consent to
                     such transfers, provided they adhere to the safeguards
                     outlined above.
                  </p>
               </section>

               <section id="childrens-privacy">
                  <h2>8. Children’s Privacy</h2>
                  <p>
                     Our Service is not designed for or directed toward
                     individuals under the age of majority in their respective
                     jurisdictions. We do not knowingly request or collect
                     personal data from minors. If a parent or legal guardian
                     becomes aware that a minor under their care has provided
                     personal data to Fulcrums without appropriate consent, they
                     are encouraged to contact us so that we may promptly remove
                     such information.
                  </p>
                  <p>
                     In the event that we discover a minor has created an
                     account without valid parental or guardian consent, we will
                     take steps to terminate the account and expunge any
                     personal data from our systems. This policy aligns with our
                     commitment to comply with applicable child protection laws
                     and maintain a safe, legally compliant environment for all
                     users.
                  </p>
               </section>

               <section id="user-rights">
                  <h2>9. User Rights &amp; Choices</h2>
                  <p>
                     Fulcrums respects the rights of individuals to access,
                     rectify, and control their personal data to the fullest
                     extent provided by law. Depending on your jurisdiction, you
                     may exercise the following rights:
                  </p>
                  <ul>
                     <li>
                        <strong>Right to Access:</strong> Request a copy of the
                        personal data we hold about you, as well as information
                        on how we use it and with whom it is shared.
                     </li>
                     <li>
                        <strong>Right to Rectification:</strong> Request that we
                        correct or update any inaccurate or incomplete personal
                        data in our records.
                     </li>
                     <li>
                        <strong>
                           Right to Erasure (“Right to Be Forgotten”):
                        </strong>
                        Request deletion of your personal data under certain
                        circumstances, particularly if the data is no longer
                        necessary or has been unlawfully processed.
                     </li>
                     <li>
                        <strong>Right to Restrict Processing:</strong> Object to
                        or request limitations on specific data processing
                        activities, especially if you dispute the accuracy of
                        the data or its processing is deemed unlawful.
                     </li>
                     <li>
                        <strong>Right to Data Portability:</strong> Obtain and
                        reuse your personal data across different services,
                        provided the processing is carried out by automated
                        means and is based on your consent or a contract.
                     </li>
                  </ul>
                  <p>
                     To initiate any of these requests, please contact us
                     through the details provided in Section 12 (“Contact Us”).
                     We may ask you to verify your identity before proceeding
                     with your request to ensure protection of your personal
                     data against unauthorized access.
                  </p>
                  <p>
                     If your jurisdiction provides additional rights not
                     explicitly listed here, Fulcrums will strive to honor those
                     rights in good faith. Our primary objective is to
                     facilitate transparency, clarity, and control over how your
                     personal data is managed, ensuring that you feel confident
                     and informed about our privacy practices.
                  </p>
               </section>

               <section id="security-measures">
                  <h2>10. Security Measures</h2>
                  <p>
                     Fulcrums deploys a wide range of security measures to
                     safeguard the integrity and confidentiality of personal
                     data. These measures include, but are not limited to,
                     state-of-the-art encryption protocols, secure network
                     infrastructures, routine security audits, and comprehensive
                     staff training programs. Despite these measures, no
                     security framework is entirely foolproof.
                  </p>
                  <p>
                     In the event of a breach involving your personal data, we
                     will promptly notify you and any relevant regulatory
                     bodies, as mandated by applicable law. We will also take
                     all appropriate steps to isolate and remediate the breach,
                     including forensic analysis, system upgrades, and any
                     necessary corrective actions to minimize future risks. We
                     value your trust and will make every effort to maintain and
                     reinforce your confidence in our data protection practices.
                  </p>
                  <p>
                     We encourage all users to take additional precautions in
                     protecting their personal data, such as choosing strong,
                     unique passwords, periodically updating login credentials,
                     and employing secure networks when accessing the Service.
                     Your cooperation in these efforts is integral to our mutual
                     success in upholding a safe, privacy-focused environment.
                  </p>
               </section>

               <section id="changes-policy">
                  <h2>11. Changes to This Policy</h2>
                  <p>
                     We may periodically revise this Privacy Policy to reflect
                     adjustments in our operations, regulatory mandates, or
                     technology enhancements. When we make significant
                     modifications, we will notify you via email (if you have
                     provided your email address) or through a prominent notice
                     on our website prior to implementing the changes. The “Last
                     Updated” date associated with this Policy will reflect the
                     most recent version.
                  </p>
                  <p>
                     We strongly advise checking this page regularly to remain
                     informed about how we collect, process, and secure your
                     personal data. Your continued use of our Service following
                     any Policy modifications will be interpreted as your
                     acceptance of the updated terms. If you do not agree with
                     the revised Policy, you must discontinue all usage of our
                     Service.
                  </p>
                  <p>
                     In circumstances where additional notice or consent is
                     required by law, Fulcrums will comply by either seeking
                     your explicit approval or providing supplementary
                     disclosures outlining the changes and their potential
                     impact on your privacy rights.
                  </p>
               </section>

               <section id="contact-info">
                  <h2>12. Contact Us</h2>
                  <p>
                     If you have any questions, concerns, or requests regarding
                     this Privacy Policy, our data handling practices, or if you
                     wish to exercise any legal rights you may have, we invite
                     you to get in touch with us through the following details:
                  </p>
                  <address>
                     <strong>Fulcrums</strong>
                     <br />
                     Email:{" "}
                     <a href="mailto:support@fulcrums.ca">
                        support@fulcrums.ca
                     </a>
                     <br />
                     Website:{" "}
                     <a
                        href="https://fulcrums.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        fulcrums.ca
                     </a>
                  </address>
                  <p>
                     We are firmly committed to resolving any concerns you may
                     have about your privacy and the handling of your personal
                     data. In the event that you are unsatisfied with our
                     response and your region has a dedicated data protection
                     authority or regulatory body, you retain the right to lodge
                     a complaint with the relevant authority.
                  </p>
                  <p
                     style={{
                        marginTop: "40px",
                        color: "var(--secondary-color)",
                        fontWeight: 600,
                     }}
                  >
                     <strong>
                        Thank you for placing your trust in Fulcrums and
                        allowing us to safeguard your personal information.
                     </strong>
                  </p>
               </section>
            </main>
         </div>

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </React.Fragment>
   );
}

export default PrivacyPolicyPage;