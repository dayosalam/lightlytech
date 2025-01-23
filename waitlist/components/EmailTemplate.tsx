import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WaitlistEmailProps {
  userEmail?: string;
}

const WaitlistEmail = ({ userEmail = "there" }: WaitlistEmailProps) => {
  return (
    <Html>
      <Head>
        <title>You're on the Lightly waitlist!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>You&apos;re on the Lightly waitlist!</Preview>
      <Body
        style={{
          backgroundColor: "white",
          fontFamily: "inter",
          padding: 0,
          margin: 0,
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "20px 0",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: "#002B20",
            }}
          >
            <Img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/lightly.png`}
              width="120"
              height="32"
              alt="Lightly"
              style={{
                margin: "20px auto",
                display: "block",
                maxWidth: "100%",
              }}
            />
          </Section>

          {/* Main Content */}
          <Section
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "70px 25px",
            }}
          >
            <Text
              style={{
                fontSize: "36px",
                fontWeight: "900",
                lineHeight: "40px",
                color: "#002B20",
                marginBottom: "45px",
                textAlign: "left",
              }}
            >
              You&apos;re on the Waitlist! 🎉
            </Text>

            <Text
              style={{
                color: "#022322",
                marginBottom: "27px",
                fontSize: "16px",
                lineHeight: "26px",
                fontWeight: "400",
                textAlign: "left",
              }}
            >
              Congratulations! You&apos;ve secured a spot on the exclusive
              Waitlist for Lightly. To deliver a seamless experience that meets
              our customers&apos; expectations, we will send out invitations in
              stages.
            </Text>

            <Button
              href="https://lightly.app/announcement"
              style={{
                backgroundColor: "#002B20",
                color: "white",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: "500",
                textDecoration: "none",
                marginBottom: "27px",
                display: "inline-block",
              }}
            >
              See announcement
            </Button>

            <Text
              style={{
                color: "#413E3F",
                fontSize: "12px",
                lineHeight: "18px",
                marginTop: "24px",
                textAlign: "left",
              }}
            >
              You&apos;re receiving this email because you signed up for the
              Lightly waitlist. If this doesn&apos;t seem right, please feel
              free to disregard this message.
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#002B20",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              Don&apos;t want any more emails from Lightly?{" "}
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${userEmail}`}
                style={{
                  color: "white",
                  fontWeight: "800",
                  fontSize: "12px",
                }}
              >
                Unsubscribe
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WaitlistEmail;
