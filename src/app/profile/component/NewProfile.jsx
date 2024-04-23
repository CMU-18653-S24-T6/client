import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PersonalProfile({data, onEdit}) {
    let uid = '';
    if (data === null) {
        return (
            <Container>
                Welcome, you don&apos;t have any profile yet.
                <Button variant="primary" type="edit" onClick={onEdit}>Create</Button>
            </Container>
        );
    }
    if ('uid' in data) {
      uid = data.uid;
    } 
    return (
    <section className="vh-100" style={{ backgroundColor: '#f4f5f7', color: '#000000' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0">
                <MDBCol md="4" className="gradient-custom text-center"
                        style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <MDBCardImage src={data?.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"}
                                alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                  <MDBTypography tag="h5">{data.firstName + ' ' + data.lastName}</MDBTypography>
                  <Button variant="info" size="sm" className="mt-3 custom-button">
                        <Link href={`/review/history/${uid}`} style={{ color: 'white' }}>
                            Reviews
                        </Link>
                    </Button>
                  <MDBIcon far icon="edit mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Email</MDBTypography>
                        <MDBCardText className="text-muted">{data.email}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Phone</MDBTypography>
                        <MDBCardText className="text-muted">{data.tel}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Date of Birth</MDBTypography>
                        <MDBCardText className="text-muted">{data.dob.substring(0, 10)}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Address</MDBTypography>
                        <MDBCardText className="text-muted">{data.address}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <Button variant="primary" type="edit" onClick={onEdit}>
                        Edit
                    </Button>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
