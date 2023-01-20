import { NextPage } from "next";

const TermsOfService: NextPage = () => {
  return (
    <main className="prose prose-invert">
      <h1>Terms of Service</h1>
      <br></br>
      <div>Effective Date: Jan 19 2023</div>
      <br />
      <div>
        <p>
          Welcome to Kawaii Keeper, a discord bot that leverages the power of AI
          to generate Anime images. Please read on to learn the rules and
          restrictions that govern your use of our website(s), proprietary bots,
          and other applications (the “Services”). If you have any questions,
          comments, or concerns regarding these terms or the Services, please
          join our official server: Kawaii Keeper Official Server.{" "}
        </p>
        <p>
          These Terms of Use (the “Terms”) are a binding contract between you
          and Kawaii Keeper. (“we” and “us”). Your use of the Services in any
          way means that you agree to all of these Terms, and these Terms will
          remain in effect while you use the Services. These Terms include the
          provisions in this document as well as those in the Privacy Policy.
          Your use of or participation in certain Services may also be subject
          to additional policies, rules and/or conditions (“Additional Terms”),
          which are incorporated herein by reference, and you understand and
          agree that by using or participating in any such Services, you agree
          to also comply with these Additional Terms.
        </p>
        <p>
          <b>
            Please read these Terms carefully. They cover important information
            about Services provided to you. These Terms include information
            about future changes to these Terms, automatic renewals, limitations
            of liability, a class action waiver and resolution of disputes by
            arbitration instead of in court. PLEASE NOTE THAT YOUR USE OF AND
            ACCESS TO OUR SERVICES ARE SUBJECT TO THE FOLLOWING TERMS; IF YOU DO
            NOT AGREE TO ALL OF THE FOLLOWING, YOU MAY NOT USE OR ACCESS THE
            SERVICES IN ANY MANNER.
          </b>
        </p>
        <p>
          {" "}
          ARBITRATION NOTICE AND CLASS ACTION WAIVER: EXCEPT FOR CERTAIN TYPES
          OF DISPUTES DESCRIBED IN THE ARBITRATION AGREEMENT SECTION BELOW, YOU
          AGREE THAT DISPUTES BETWEEN YOU AND US WILL BE RESOLVED BY BINDING,
          INDIVIDUAL ARBITRATION AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A
          CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.
        </p>
      </div>
      <h1>Will these Terms ever change? </h1>
      <p>
        We are constantly trying to improve our Services, so these Terms may
        need to change along with our Services. We reserve the right to change
        the Terms at any time, but if we do, we will place a notice on our site
        located at https://kawaiikeeper.vercel.app/, or the official server.
      </p>
      <p>
        If you don’t agree with the new Terms, you are free to reject them;
        unfortunately, that means you will no longer be able to use the
        Services. If you use the Services in any way after a change to the Terms
        is effective, that means you agree to all of the changes.
      </p>
      <h1>What about my privacy?</h1>
      <p>
        Kawaii Keeper takes the privacy of its users very seriously. For the
        current Privacy Policy, please <a href="/privacy-policy">click here</a>.
      </p>
      <p>
        The Children’s Online Privacy Protection Act (“COPPA”) requires that
        online service providers obtain parental consent before they knowingly
        collect personally identifiable information online from children who are
        under thirteen (13). We do not knowingly collect or solicit personally
        identifiable information from children under sixteen (13); if you are a
        child under thirteen (13), please do not attempt to register for or
        otherwise use the Services or send us any personal information. If we
        learn we have collected personal information from a child under thirteen
        (13), we will delete that information as quickly as possible. If you
        believe that a child under thirteen (13) may have provided us personal
        information, please contact us at our official discord server.
      </p>
      <h1>What are the basics of using Kawaii Keeper? </h1>
      <p>
        You may need to access certain parts or features of the Services (e.g.
        our proprietary bots) by using your account credentials and password
        from other services (“Third Party Account”), such as those offered by
        Discord. By using the Services through a Third Party Account, you permit
        us to access certain information from such account for use by the
        Services. You are ultimately in control of how much information is
        accessible to us and may exercise such control by adjusting your privacy
        settings on your Third Party Account. We store your account credentials
        but will not store your password. You promise to provide us with
        accurate, complete, and updated registration information about yourself.
        You may not use any Third Party Account that you do not have the right
        to use, or another person’s account credentials without authorization
        from that other person. You may not transfer your account to anyone else
        without our prior written permission.
      </p>
      <p>
        You will only use the Services for your own internal, personal,
        non-commercial use, and not on behalf of or for the benefit of any third
        party or any entity, and only in a manner that complies with all laws
        that apply to you. If your use of the Services is prohibited by
        applicable laws, then you aren’t authorized to use the Services. We
        can’t and won’t be responsible for your using the Services in a way that
        breaks the law.
      </p>
      <p>
        You must protect the security of your Third Party Account credentials
        and password and any other access tools or credentials. You’re
        responsible for any activity associated with your account.
      </p>
      <h1>Punishable Acts</h1>
      <div>
        <p>
          We reserve the rights to refuse to provide you with the services if in
          case we found the user guilty of performing or indulging in the
          prohibited actions listed below will lead to permanent suspension of
          your account:
        </p>
        <ul>
          <li>
            Indulging in Malicious / Suspicious activity like gaining
            unauthorized access, DDOS-ing our servers, over abusing game
            breaking bugs.
          </li>
          <li>Using images of real people without consent.</li>
          <li>
            Supporting someone who is involved in carrying out these acts.
          </li>
        </ul>
      </div>
      <h1>How do i appeal if my account is suspended?</h1>
      <p>
        You can appeal for an account review on our support server after 30 days
        of serving your suspension period. We reserve the rights to keep your
        account suspended if found guilty.
      </p>
      <h1>
        What if I see something on the services that infringes my copyright?
      </h1>
      <p>
        We respect others’ intellectual property rights, and we reserve the
        right to delete or disable Content alleged to be infringing, or provide
        content credit on the platform up on agreement of both parties.
      </p>
      <h1>Do the services cost anything?</h1>
      <p>
        The Services is currently free for your personal and non-commercial use.
      </p>
      <h1>What if I want to stop using the services?</h1>
      <p>
        You’re free to do that at any time by contacting us on the official
        Kawaii Keeper Server or reach out to us through the support page. If you
        are an administrator, you may disconnect the Service from your server at
        any time. Account termination may result in destruction of any Content
        associated with your account, so keep that in mind before you decide to
        terminate your account.
      </p>
    </main>
  );
};

export default TermsOfService;
