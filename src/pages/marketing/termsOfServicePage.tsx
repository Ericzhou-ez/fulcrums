import React from "react";
import "../../styles/terms.css";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import FloatingTocNav from "../../components/core/FloatingTocNav";
import { Tooltip, useTheme } from "@mui/material";
import BottomCTA from "../../components/marketing/bottomCta";
import { useState, useEffect, useRef } from "react";
import FooterName from "../../assets/images/footerName.svg";
import { useThemeContext } from "../../contexts/themeContextProvider";

const TOS_SECTIONS = [
   { id: "acceptance-of-terms", label: "1. Acceptance of Terms" },
   { id: "description-of-service", label: "2. Description of the Service" },
   { id: "modifications", label: "3. Modifications to Terms" },
   { id: "user-accounts", label: "4. User Accounts & Responsibilities" },
   { id: "data-input", label: "5. Data Input & Disclaimer" },
   { id: "intellectual-property", label: "6. Intellectual Property" },
   { id: "fees-payments", label: "7. Fees & Payments" },
   { id: "termination", label: "8. Termination" },
   { id: "disclaimers", label: "9. Disclaimers" },
   { id: "limitation-liability", label: "10. Limitation of Liability" },
   { id: "indemnification", label: "11. Indemnification" },
   { id: "governing-law", label: "12. Governing Law & Dispute Resolution" },
   { id: "force-majeure", label: "13. Force Majeure" },
   { id: "miscellaneous", label: "14. Miscellaneous" },
   { id: "contact-us", label: "15. Contact Us" },
];

interface TermsOfServicePageProps {
   toggleModal: () => void;
   isModalOpen: boolean;
}

function TermsOfServicePage({
   toggleModal,

   isModalOpen,
}: TermsOfServicePageProps) {
   const [footerHeight, setFooterHeight] = useState(0);
   const imgRef = useRef<HTMLImageElement | null>(null);
   useEffect(() => {
      if (imgRef.current) {
         setFooterHeight(imgRef.current.clientHeight);
      }
   }, []);

   useEffect(() => {
      document.title = "Fulcrums | 条款";
   }, []);

   const { isDark } = useThemeContext();

   return (
      <React.Fragment>
         <Nav
            toggleModal={toggleModal}
            isModalOpen={isModalOpen}
            home={true}
            navOpen={false}
            setNavOpen={null}
            overlay={false}
            setOverlay={() => {}}
            searchBar={false}
         />

         <FloatingTocNav
            sections={TOS_SECTIONS}
            hoveredWidth={"250"}
            defaultWidth={"50"}
         />

         <div
            style={{
               position: "relative",
               zIndex: 10,
               marginBottom: `${footerHeight}px`,
               backgroundColor: "var(--background-color)",
            }}
         >
            <div className="tos-container">
               <nav className="tos-nav">
                  <h1>Fulcrums Terms of Service</h1>
                  <ul>
                     <li>
                        <a href="#acceptance-of-terms">
                           1. Acceptance of Terms
                        </a>
                     </li>
                     <li>
                        <a href="#description-of-service">
                           2. Description of the Service
                        </a>
                     </li>
                     <li>
                        <a href="#modifications">
                           3. Modifications to the Terms or Service
                        </a>
                     </li>
                     <li>
                        <a href="#user-accounts">
                           4. User Accounts and Responsibilities
                        </a>
                     </li>
                     <li>
                        <a href="#data-input">5. Data Input and Disclaimer</a>
                     </li>
                     <li>
                        <a href="#intellectual-property">
                           6. Intellectual Property
                        </a>
                     </li>
                     <li>
                        <a href="#fees-payments">7. Fees and Payments</a>
                     </li>
                     <li>
                        <a href="#termination">8. Termination</a>
                     </li>
                     <li>
                        <a href="#disclaimers">9. Disclaimers</a>
                     </li>
                     <li>
                        <a href="#limitation-liability">
                           10. Limitation of Liability
                        </a>
                     </li>
                     <li>
                        <a href="#indemnification">11. Indemnification</a>
                     </li>
                     <li>
                        <a href="#governing-law">
                           12. Governing Law and Dispute Resolution
                        </a>
                     </li>
                     <li>
                        <a href="#force-majeure">13. Force Majeure</a>
                     </li>
                     <li>
                        <a href="#miscellaneous">14. Miscellaneous</a>
                     </li>
                     <li>
                        <a href="#contact-us">15. Contact Us</a>
                     </li>
                  </ul>
               </nav>

               <main className="tos-content">
                  <section id="acceptance-of-terms">
                     <h2>1. Acceptance of Terms</h2>
                     <p>
                        By accessing or using the Service, you confirm that you
                        can form a legally binding contract with Fulcrums and
                        that you accept these Terms. If you are using the
                        Service on behalf of an organization, you confirm that
                        you have the authority to bind that organization to
                        these Terms. You further agree that your use of the
                        Service constitutes your ongoing and unconditional
                        acceptance of these Terms, and that you have understood
                        all implications therein.
                     </p>
                     <p>
                        Furthermore, by continuing to access the Service, you
                        represent and warrant that you are of the age of
                        majority in your jurisdiction and capable of entering
                        into a legally enforceable agreement. Any use or access
                        to the Service by anyone under the age of majority is
                        strictly prohibited and in violation of these Terms.
                     </p>
                     <p>
                        In the event that you do not agree with any or all of
                        the provisions contained herein, you must cease use of
                        the Service immediately. These Terms govern your usage
                        of Fulcrums, including all updates and revisions. Any
                        breach of these Terms may result in immediate
                        termination of your account and access to the Service,
                        as determined solely by Fulcrums.
                     </p>
                     <p>
                        You also acknowledge that Fulcrums may, from time to
                        time, introduce new features, modify existing features,
                        or remove features at its sole discretion. Your
                        continued use of the Service following any such changes
                        shall be deemed acceptance of any modified Terms, as
                        referenced in Section 3 below.
                     </p>
                  </section>

                  <section id="description-of-service">
                     <h2>2. Description of the Service</h2>
                     <p>
                        Fulcrums provides software tools and functionality for
                        supply chain tracking, quotation generation, and customs
                        declaration. The Service consolidates supplier
                        information, pricing data, inventory management, and
                        customs documentation to streamline internal business
                        processes and improve efficiency.
                     </p>
                     <p>
                        Key functionalities include (but are not limited to):
                     </p>
                     <ul>
                        <li>Product Tracking &amp; Supply Chain Management</li>
                        <li>Quotation &amp; Invoice Automation</li>
                        <li>Customs Declaration &amp; Compliance</li>
                     </ul>
                     <p>
                        Fulcrums is designed to centralize supplier data, track
                        minimum order quantities, analyze historical pricing,
                        and facilitate international trade compliance. By
                        enabling synchronization of data across these various
                        operational facets, Fulcrums aims to reduce manual
                        errors, save time, and enhance the consistency and
                        reliability of business workflows.
                     </p>
                     <p>
                        You may need to register for an account and provide
                        certain information (such as contact details or billing
                        information) to access specific features of the Service.
                        Certain features may also be governed by supplemental
                        terms or usage guidelines, which will be provided to you
                        within the Service interface or during the registration
                        process. You agree that Fulcrums may collect and use
                        such information in compliance with its Privacy Policy.
                     </p>
                     <p>
                        Nothing in this section shall be construed to obligate
                        Fulcrums to maintain any particular aspect of the
                        Service beyond what is deemed reasonably feasible, nor
                        shall this section limit Fulcrums’s ability to adapt,
                        evolve, or discontinue aspects of the Service as
                        described in these Terms.
                     </p>
                  </section>

                  <section id="modifications">
                     <h2>3. Modifications to the Terms or Service</h2>
                     <p>
                        We may modify these Terms at any time by posting an
                        updated version on this page and indicating the “Last
                        Updated” date. We may also, at our discretion, notify
                        you via email or by a prominent notice on the Site when
                        significant changes occur. Any changes will become
                        effective immediately upon posting unless otherwise
                        specified.
                     </p>
                     <p>
                        By continuing to use or access the Service after any
                        modifications become effective, you agree to be bound by
                        the revised Terms. You are responsible for reviewing
                        these Terms periodically to remain informed about any
                        changes. If at any time you find that you cannot or will
                        not accept the modified Terms, you must cease use of the
                        Service.
                     </p>
                     <p>
                        In addition, Fulcrums reserves the right to modify,
                        suspend, or discontinue any part of the Service
                        (including, but not limited to, paid features) at any
                        time and without notice or liability to you. Such
                        modifications may include, but are not limited to,
                        feature enhancements, software patches, bug fixes, or
                        complete removal of certain functionalities.
                     </p>
                     <p>
                        Your continued use of the Service following any
                        suspension, modification, or discontinuation of the
                        Service (or any portion thereof) constitutes acceptance
                        of those changes. Fulcrums will not be liable if, for
                        any reason, all or any part of the Service is
                        unavailable at any time or for any period.
                     </p>
                  </section>

                  <section id="user-accounts">
                     <h2>4. User Accounts and Responsibilities</h2>
                     <ol>
                        <li>
                           <strong>Account Creation:</strong>
                           To use certain features of the Service, you must
                           create a user account. You agree to provide accurate
                           and complete information when creating your account
                           and keep it updated at all times. You shall not
                           assume or use a false identity or provide information
                           that is fraudulent, misleading, or otherwise in
                           violation of applicable laws.
                        </li>
                        <li>
                           <strong>Account Security:</strong>
                           You are responsible for all activity on your account
                           and for maintaining the confidentiality of your login
                           credentials, including any passwords or
                           authentication tokens. If you suspect any
                           unauthorized use of your account or login
                           credentials, you must notify us immediately. Fulcrums
                           shall not be liable for any loss or damage arising
                           from your failure to safeguard your login
                           credentials.
                        </li>
                        <li>
                           <strong>User Conduct:</strong>
                           You agree not to use the Service in a manner that
                           violates any applicable laws or regulations,
                           infringes upon the rights of others, or interferes
                           with the normal functioning of the Service. You
                           further agree that:
                           <ul>
                              <li>
                                 You will not upload or transmit harmful
                                 content, including viruses, spyware, or any
                                 other malicious code.
                              </li>
                              <li>
                                 You will not engage in any activity that
                                 disrupts or damages the Service or Fulcrums’s
                                 servers.
                              </li>
                              <li>
                                 You will not harvest or collect information
                                 about other users, including personal data,
                                 without their explicit consent.
                              </li>
                              <li>
                                 You will comply with all policies, guidelines,
                                 and instructions provided by Fulcrums related
                                 to the use of the Service.
                              </li>
                           </ul>
                        </li>
                     </ol>
                  </section>

                  <section id="data-input">
                     <h2>5. Data Input and Disclaimer</h2>
                     <p>
                        Fulcrums allows you to input and store data (“User
                        Data”), including product information, supplier details,
                        pricing, and other relevant business information.{" "}
                        <strong>
                           When you input data into our Service, you do so at
                           your own risk.
                        </strong>
                     </p>
                     <ul>
                        <li>
                           <strong>No Liability for User Data:</strong>
                           We strive to provide secure and reliable data
                           storage, but
                           <strong>
                              {" "}
                              Fulcrums shall not be liable for any loss, damage,
                              or unauthorized access to your User Data.
                           </strong>{" "}
                           It is your responsibility to maintain backups of your
                           data and to ensure you have adequate data recovery
                           systems in place. Fulcrums does not guarantee
                           continuous access to the Service and encourages you
                           to keep independent copies of any critical
                           information.
                        </li>
                        <li>
                           <strong>Data Protection Efforts:</strong>
                           We use commercially reasonable efforts to protect
                           User Data from loss, misuse, and unauthorized access.
                           However,
                           <strong>
                              we do not warrant or guarantee that User Data will
                              never be subject to unauthorized access, loss, or
                              corruption.
                           </strong>{" "}
                           As such, you agree to implement and maintain
                           appropriate security measures to protect your data
                           against inadvertent damage or malicious intrusion.
                        </li>
                        <li>
                           <strong>Data Accuracy:</strong>
                           You are solely responsible for the accuracy, quality,
                           and legality of the data you input, as well as for
                           obtaining any necessary permissions to use that data.
                           Fulcrums shall not be liable for any errors or
                           inaccuracies in the data provided by you, nor any
                           resulting issues arising out of reliance on such
                           data.
                        </li>
                     </ul>
                  </section>

                  <section id="intellectual-property">
                     <h2>6. Intellectual Property</h2>
                     <ol>
                        <li>
                           <strong>Fulcrums IP:</strong>
                           All content, materials, features, and functionality
                           provided by Fulcrums (including but not limited to
                           software, design, text, graphics, images, logos, and
                           trademarks) are owned by or licensed to Fulcrums. You
                           may use Fulcrums’s intellectual property only in
                           connection with your use of the Service and in
                           compliance with these Terms. You acquire no right,
                           title, or interest in or to any Fulcrums IP. Any
                           unauthorized use, reproduction, or distribution of
                           our IP is strictly prohibited and may result in legal
                           action.
                        </li>
                        <li>
                           <strong>User Content:</strong>
                           You retain all rights to the data and other materials
                           you upload to the Service. By uploading your User
                           Data, you grant Fulcrums a non-exclusive, worldwide,
                           royalty-free license to store, use, reproduce,
                           display, and distribute your data only as necessary
                           to operate, improve, and provide the Service. You
                           represent and warrant that you have the necessary
                           rights and permissions to grant such license and that
                           your User Data does not infringe or violate the
                           intellectual property, privacy, or any other rights
                           of third parties.
                        </li>
                     </ol>
                  </section>

                  <section id="fees-payments">
                     <h2>7. Fees and Payments</h2>
                     <p>
                        Certain features of Fulcrums may require payment of
                        fees. You agree to pay all fees specified in any
                        relevant order forms, subscription plans, or invoices.
                        All fees are non-refundable unless stated otherwise. We
                        reserve the right to modify our fees, but we will
                        provide advance notice for any fee changes that affect
                        existing subscriptions. If you do not agree to the fee
                        changes, you must cancel your subscription or
                        discontinue use of the paid features before the
                        effective date of the fee change.
                     </p>
                     <p>
                        You are responsible for providing complete and accurate
                        billing information, including your legal name, address,
                        and any payment details. By submitting such payment
                        information, you grant Fulcrums the right to store and
                        process this information, and to charge your payment
                        method for all applicable fees. If any payment is not
                        successfully settled or is otherwise returned as unpaid,
                        Fulcrums reserves the right to suspend or terminate
                        access to paid features.
                     </p>
                  </section>

                  <section id="termination">
                     <h2>8. Termination</h2>
                     <ol>
                        <li>
                           <strong>Termination by You:</strong>
                           You may terminate your account at any time by
                           contacting Fulcrums or by using any self-service
                           account cancellation options we provide. Upon
                           termination, you remain responsible for any
                           outstanding fees or charges incurred prior to
                           termination.
                        </li>
                        <li>
                           <strong>Termination by Fulcrums:</strong>
                           We reserve the right to suspend or terminate your
                           access to the Service at any time, without prior
                           notice, if you breach these Terms or engage in any
                           activity that may harm Fulcrums or its users. We also
                           reserve the right to terminate the Service or any
                           part thereof at any time, with or without notice.
                        </li>
                        <li>
                           <strong>Effect of Termination:</strong>
                           Upon termination, your right to use the Service will
                           immediately cease. We will have no obligation to
                           maintain or forward any data in your account, but may
                           retain it for a commercially reasonable period of
                           time or as required by law. You agree that Fulcrums
                           shall not be liable to you or any third party for any
                           termination of your access to the Service.
                        </li>
                     </ol>
                  </section>

                  <section id="disclaimers">
                     <h2>9. Disclaimers</h2>
                     <ol>
                        <li>
                           <strong>“As-Is” Basis:</strong>
                           The Service, including all information, content, and
                           materials contained therein, is provided on an “as
                           is” and “as available” basis, without warranties of
                           any kind, either expressed or implied. Fulcrums
                           disclaims all warranties, whether statutory, express,
                           or implied, including but not limited to warranties
                           of title, merchantability, or fitness for a
                           particular purpose.
                        </li>
                        <li>
                           <strong>No Warranty:</strong>
                           To the fullest extent permitted by law, Fulcrums
                           disclaims all warranties, expressed or implied,
                           including warranties of merchantability, fitness for
                           a particular purpose, and non-infringement.
                           <strong>
                              {" "}
                              We do not guarantee that the Service will be
                              error-free, uninterrupted, secure, or free from
                              viruses or other harmful components.
                           </strong>
                           You understand that operation of the Service may be
                           interrupted by numerous factors outside Fulcrums’s
                           control.
                        </li>
                        <li>
                           <strong>Data Disclaimer:</strong>{" "}
                           <strong>
                              Fulcrums is not responsible for the accuracy,
                              completeness, legality, or reliability of any data
                              input by the user. All data is entered and used at
                              the user’s own risk.
                           </strong>
                           You acknowledge that reliance on any data or
                           information provided by other users or third parties
                           via the Service is at your own discretion and risk,
                           and Fulcrums bears no responsibility for any
                           resulting loss or damage.
                        </li>
                     </ol>
                  </section>

                  <section id="limitation-liability">
                     <h2>10. Limitation of Liability</h2>
                     <ol>
                        <li>
                           <strong>Indirect Damages:</strong>
                           To the fullest extent permitted by law, in no event
                           shall Fulcrums or its affiliates, officers,
                           employees, agents, partners, or licensors be liable
                           for any indirect, incidental, special, consequential,
                           or punitive damages, including without limitation,
                           lost profits, data loss, or damages resulting from
                           business interruption, whether based on warranty,
                           contract, tort (including negligence), or any other
                           legal theory.
                        </li>
                        <li>
                           <strong>Cap on Liability:</strong>{" "}
                           <strong>
                              In no event will Fulcrums’s total cumulative
                              liability for any claims arising out of or related
                              to these Terms or the Service exceed the greater
                              of (a) the total amount paid to Fulcrums by you in
                              the six (6) months preceding the event giving rise
                              to the claim, or (b) fifty Canadian dollars (CAD
                              50).
                           </strong>
                           This limitation applies regardless of whether
                           Fulcrums has been advised of the possibility of such
                           damages.
                        </li>
                        <li>
                           <strong>No Further Liability:</strong>{" "}
                           <strong>
                              We try our best to protect data; however, we shall
                              not be liable in any way for any data breaches,
                              losses, or other damages related to data.
                           </strong>
                           Your use of the Service and the data you input is
                           done entirely at your own risk. You acknowledge that
                           no security measure can guarantee absolute protection
                           from all threats or vulnerabilities.
                        </li>
                     </ol>
                  </section>

                  <section id="indemnification">
                     <h2>11. Indemnification</h2>
                     <p>
                        You agree to indemnify, defend, and hold harmless
                        Fulcrums and its affiliates, officers, directors,
                        employees, and agents from and against any and all
                        claims, damages, obligations, losses, liabilities,
                        costs, or debt, and expenses (including reasonable
                        attorneys’ fees) arising out of:
                     </p>
                     <ol>
                        <li>Your use of and access to the Service;</li>
                        <li>Your violation of any provision of these Terms;</li>
                        <li>
                           Your violation of any third-party right, including
                           without limitation any intellectual property or
                           privacy right; or
                        </li>
                        <li>
                           Any claim that your data caused damage to a third
                           party.
                        </li>
                     </ol>
                     <p>
                        You agree to cooperate as fully as reasonably required
                        in the defense of any such claim. Fulcrums reserves the
                        right, at its own expense, to assume the exclusive
                        defense and control of any matter subject to
                        indemnification by you, and you shall not in any event
                        settle any claim without the prior written consent of
                        Fulcrums.
                     </p>
                  </section>

                  <section id="governing-law">
                     <h2>12. Governing Law and Dispute Resolution</h2>
                     <p>
                        These Terms and any action related thereto shall be
                        governed by the laws of the Province of [Province],
                        Canada, without regard to its conflict of laws
                        provisions. Any disputes arising out of or relating to
                        these Terms or the Service shall be resolved exclusively
                        in the provincial or federal courts located in
                        [Province], Canada, and you consent to the personal
                        jurisdiction of such courts.
                     </p>
                     <p>
                        Notwithstanding the foregoing, Fulcrums reserves the
                        right to seek injunctive or other equitable relief in
                        any court of competent jurisdiction to prevent or
                        restrain breaches of these Terms. You acknowledge that a
                        violation of certain obligations set forth in these
                        Terms may result in irreparable harm to Fulcrums, for
                        which monetary damages would not be an adequate remedy.
                     </p>
                  </section>

                  <section id="force-majeure">
                     <h2>13. Force Majeure</h2>
                     <p>
                        Fulcrums shall not be liable for any delay or failure to
                        perform resulting from causes outside its reasonable
                        control, such as natural disasters, strikes, accidents,
                        acts of war, terrorism, governmental acts, or Internet
                        disturbances. In any such event, Fulcrums shall be
                        excused from any further performance of the obligations
                        that are affected by the condition, for as long as such
                        condition exists and impairs performance.
                     </p>
                     <p>
                        If a force majeure event extends for a period exceeding
                        thirty (30) days, either party may elect to terminate
                        the Services immediately upon written notice to the
                        other party, without liability for such termination.
                     </p>
                  </section>

                  <section id="miscellaneous">
                     <h2>14. Miscellaneous</h2>
                     <ol>
                        <li>
                           <strong>Entire Agreement: </strong>
                           These Terms, along with our Privacy Policy (if
                           applicable), constitute the entire agreement between
                           you and Fulcrums regarding your use of the Service.
                           They supersede any prior or contemporaneous
                           agreements, communications, and proposals, whether
                           oral or written, between you and Fulcrums.
                        </li>
                        <li>
                           <strong>Severability: </strong>
                           If any part of these Terms is held invalid or
                           unenforceable, that portion of the Terms will be
                           construed to reflect the parties’ original intent,
                           and the remaining portions will remain in full force
                           and effect. The invalid or unenforceable portion
                           shall be replaced with a provision that most closely
                           reflects the parties’ intent while remaining
                           enforceable.
                        </li>
                        <li>
                           <strong>Waiver: </strong>
                           No waiver of any term of these Terms shall be deemed
                           a further or continuing waiver of such term or any
                           other term, and Fulcrums’s failure to assert any
                           right or provision under these Terms shall not
                           constitute a waiver of such right or provision.
                        </li>
                        <li>
                           <strong>Assignment: </strong>
                           These Terms and any rights or licenses granted
                           hereunder may not be transferred or assigned by you,
                           but may be assigned by Fulcrums without restriction.
                           Any attempted transfer or assignment in violation
                           hereof shall be null and void.
                        </li>
                        <li>
                           <strong>No Partnership: </strong>
                           No partnership, joint venture, employment, or agency
                           relationship exists between you and Fulcrums as a
                           result of these Terms or your use of the Service. You
                           agree that neither party has the authority to bind
                           the other in any manner.
                        </li>
                     </ol>
                  </section>

                  <section id="contact-us">
                     <h2>15. Contact Us</h2>
                     <p>
                        If you have any questions, concerns, or feedback
                        regarding these Terms or the Service, please contact us
                        at:
                     </p>
                     <address>
                        <strong>Fulcrums</strong>
                        <br />
                        Email:{" "}
                        <Tooltip title="email me">
                           <a href="mailto:zhoueric882@gmail.com">
                              zhoueric882@gmail.com
                           </a>
                        </Tooltip>
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
                        By using Fulcrums, you acknowledge that you have read
                        these Terms of Service, understand them, and agree to be
                        bound by all of the provisions herein. If you do not
                        agree with these Terms, you should discontinue use of
                        the Service immediately. Your acceptance of these Terms
                        is renewed each time you use, access, or otherwise
                        interface with Fulcrums’s offerings.
                     </p>
                     <p
                        style={{
                           marginTop: "40px",
                           color: "var(--secondary-color)",
                           fontWeight: "600",
                        }}
                     >
                        <strong>
                           Thank you for choosing Fulcrums: Revolutionizing
                           Supply Chain, Quotation, and Customs Management.
                        </strong>
                     </p>
                  </section>
               </main>
            </div>

            <BottomCTA />

            <div style={{ padding: "0 16px" }}>
               <Footer />
            </div>
         </div>

         <div
            style={{
               backgroundColor: isDark ? "#380e05" : "#fff2d8",
               width: "100%",
               height: `${footerHeight}px`,
               position: "fixed",
               bottom: 0,
               zIndex: 0,
               overflow: "hidden",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
            }}
         >
            <img
               ref={imgRef}
               src={FooterName}
               alt="Fulcrums"
               className="footer-bold-name"
               style={{
                  width: "100%",
                  objectFit: "cover",
               }}
               onLoad={() => {
                  if (imgRef.current) {
                     setFooterHeight(imgRef.current.clientHeight);
                  }
               }}
            />
         </div>
      </React.Fragment>
   );
}

export default TermsOfServicePage;
