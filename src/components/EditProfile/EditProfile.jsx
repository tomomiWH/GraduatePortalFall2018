import React, { Component } from "react";
import history from "../../history";
import {
  FormGroup,
  FormControl,
  HelpBlock,
  Button,
  ControlLabel,
  Checkbox
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorMessage from "../Widgets/ErrorMessage";
import ModalWidget from "../Widgets/Modal";
import noPic from "../../images/no-profile.svg";
import resumeIcon from "../../images/resume-icon.svg";

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id} bsClass="form-group grad-form-group">
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class EditProfile extends Component {
  state = {
    graduateId: this.props.match.params.graduateId,
    isNew: false,
    isAdmin: true,
    isLoading: false,
    hasError: false,
    profileData: {
      graduateId: "",
      firstName: "",
      lastName: "",
      skills: "",
      github: "",
      linkedin: "",
      email: "",
      website: "",
      phone: "",
      yearOfGrad: "",
      image: "",
      resume: "",
      story: "",
      isActive: null
    },
    firstNameValid: null,
    lastNameValid: null,
    yearOfGradValid: null,
    emailValid: null,
    submitForm: false
  };

  handleEditProfile = e => {
    e.preventDefault();

    // check for validation on required fields
    const requiredArray = [
      ["firstName", "firstNameValid"],
      ["lastName", "lastNameValid"],
      ["yearOfGrad", "yearOfGradValid"],
      ["email", "emailValid"]
    ];
    for (let key of requiredArray) {
      if (!this.state.profileData[key[0]]) {
        this.setState({ [key[1]]: "error" });
      } else {
        this.setState({ [key[1]]: null });
      }
    }
    for (let key of requiredArray) {
      if (!this.state.profileData[key[0]]) return;
    }

    // convert skills back to an array and trim leading/trailing white spaces
    let skillsArray = this.state.profileData.skills.split(",");
    for (let i = 0; i < skillsArray.length; i++) {
      skillsArray[i] = skillsArray[i].trim();
    }
    let newProfileData = {
      ...this.state.profileData,
      skills: skillsArray
    };

    const response = this.props.profileEdit(newProfileData);
    this.setState({ submitForm: true, graduateId: response.graduateId });
  };

  uploadFile = e => {
    e.preventDefault();
    let name = e.target.name;
    if (name === "image")
      this.props.uploadImageFile(e.target.files[0]).then(response =>
        this.setState({
          profileData: {
            ...this.state.profileData,
            [name]: response.value.url.replace(/\s/g, "")
          }
        })
      );
    else if (name === "resume")
      this.props.uploadResumeFile(e.target.files[0]).then(response =>
        this.setState({
          profileData: {
            ...this.state.profileData,
            [name]: response.value.url.replace(/\s/g, "")
          }
        })
      );
  };

  handleCheckbox = () => {
    this.setState({
      profileData: {
        ...this.state.profileData,
        isActive: Math.abs(this.state.profileData.isActive - 1)
      }
    })
  }

  closeModal = () => {
    this.setState({
      submitForm: false
    });
  };

  linkToViewProfile = () => {
    this.setState({
      submitForm: false
    });
    history.push(`/profile/${this.state.profileData.graduateId}`);
  };

  addDefaultSrc(e) {
    e.target.src = noPic;
  }

  componentDidMount() {
    let id = this.state.graduateId;
    if (!this.props.profiles) {
      this.props.fetchAllProfiles().then(() => {
        this.setState({
          profileData: {
            graduateId: id,
            firstName: this.props.profiles[id].firstName,
            lastName: this.props.profiles[id].lastName,
            // convert skills to a string
            skills: this.props.profiles[id].skills.join(", "),
            github: this.props.profiles[id].links.github,
            linkedin: this.props.profiles[id].links.linkedin,
            email: this.props.profiles[id].links.email,
            website: this.props.profiles[id].links.website,
            phone: this.props.profiles[id].phone,
            yearOfGrad: this.props.profiles[id].yearOfGrad,
            image: this.props.profiles[id].image,
            resume: this.props.profiles[id].resume,
            story: this.props.profiles[id].story,
            isActive: this.props.profiles[id].isActive
          }
        });
      });
    } else {
      let profile = this.props.profiles[id];
      this.setState({
        profileData: {
          graduateId: id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          // convert skills to a string
          skills: profile.skills.join(", "),
          github: profile.links.github,
          linkedin: profile.links.linkedin,
          email: profile.links.email,
          website: profile.links.website,
          phone: profile.phone,
          yearOfGrad: profile.yearOfGrad,
          image: profile.image,
          resume: profile.resume,
          story: profile.story,
          isActive: profile.isActive
        }
      });
    }
  }

  render() {
    return (
      <div>
        {/* New Profile Header */}
        <div className="header-wrap container-fluid">
          <header className="container grad-header">
            <h1>Edit Graduate Profile</h1>

            {/* Add Profile Button */}
            {this.props.isAdmin && (
              <LinkContainer to="/profile/add">
                <Button
                  className="grad-btn grad-btn-admin add-btn"
                  title="Add new graduate profile"
                  bsSize="small"
                >
                  +
                </Button>
              </LinkContainer>
            )}
          </header>
        </div>

        {this.props.hasError ? (
          <div className="container">
            <ErrorMessage errorData="grad-error">
              Sorry! The Graduate Portal is temporarily down. Our engineers are
              aware of the problem and are hard at work trying to fix it. Please
              come back later.
            </ErrorMessage>
          </div>
        ) : (
          <main className="container grad-form">
            {/* OnSubmit Message */}
            <ModalWidget
              show={this.state.submitForm}
              message={"What would you like to do next?"}
              title={"Graduate Edited Successfully!"}
              closeModal={this.closeModal}
              graduateId={this.state.profileData.graduateId}
            />

            {/* Profile Image */}
            <div className="profile-thumbnail form-thumbnail">
              {this.state.profileData.image ? (
                <img
                  width={100}
                  height={100}
                  src={this.state.profileData.image}
                  alt="profile"
                  onError={this.addDefaultSrc}
                />
              ) : (
                <img
                  width={100}
                  height={100}
                  src={noPic}
                  alt="profile missing"
                />
              )}
              <div className="choose-btn">
                <h3>
                  {this.state.profileData.image ? "Update" : "Add"}
                  <br /> Image
                </h3>
              </div>
              <FieldGroup
                id="image"
                type="file"
                name="image"
                onChange={e => this.uploadFile(e)}
              />
            </div>

            {/* Profile Resume */}
            <div className="form-resume">
            {this.state.profileData.resume ?
              <img 
                src={resumeIcon}
                width={100}
                height={100}
                alt="Resume icon" />
              : (
                <div className="missing-btn">
                  <h3>Add<br />Resume</h3>
                </div>
                  )
              }
              <div className="choose-btn">
                <h3>
                  {this.state.profileData.resume ? "Update" : "Add"} Resume
                </h3>
              </div>
              <FieldGroup
                id="resume"
                type="file"
                name="resume"
                onChange={e => this.uploadFile(e)}
              />
            </div>
            
            <div className="clearfix" />

            {/* Profile Form */}
            <form onSubmit={this.handleEditProfile}>

              <FormGroup controlId="isActive" >
                <ControlLabel bsClass="control-label isActive">Profile Activated</ControlLabel>
                <Checkbox 
                  checked={!!this.state.profileData.isActive}
                  onChange={this.handleCheckbox}
                  readOnly />
              </FormGroup>

              <FormGroup
                controlId="first-name"
                validationState={this.state.firstNameValid}
              >
                <ControlLabel>
                  First Name
                  <span 
                    className={`helper helper-asterisk ${this.state.firstNameValid && "helper-asterisk-red"}`}>
                    *
                  </span>
                </ControlLabel>
                <FormControl
                  type="text"
                  placeholder="First Name"
                  value={this.state.profileData.firstName}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        firstName: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup
                controlId="last-name"
                validationState={this.state.lastNameValid}
              >
                <ControlLabel>
                  Last Name
                  <span 
                    className={`helper helper-asterisk ${this.state.lastNameValid && "helper-asterisk-red"}`}>
                    *
                  </span>
                </ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Last Name"
                  value={this.state.profileData.lastName}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        lastName: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup
                controlId="year-of-grad"
                validationState={this.state.yearOfGradValid}
              >
                <ControlLabel>
                  Year of Graduation
                  <span 
                    className={`helper helper-asterisk ${this.state.yearOfGradValid && "helper-asterisk-red"}`}>
                    *
                  </span>
                </ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Year of Graduation: YYYY"
                  value={this.state.profileData.yearOfGrad}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        yearOfGrad: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup controlId="skills">
                <ControlLabel>
                  Skills<span className="helper">- Comma delimited</span>
                </ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Skills"
                  value={this.state.profileData.skills}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        skills: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup controlId="story">
                <ControlLabel>
                  Story<span className="helper">- Max 1000 characters</span>
                </ControlLabel>
                <FormControl
                  componentClass="textarea"
                  placeholder="Story"
                  rows="4"
                  maxLength="1000"
                  value={this.state.profileData.story}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        story: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup controlId="phone">
                <ControlLabel>
                  Phone Number
                </ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Phone Number: XXX-XXX-XXXX"
                  value={this.state.profileData.phone}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        phone: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup
                controlId="email"
                validationState={this.state.emailValid}
              >
                <ControlLabel>
                  Email
                  <span 
                    className={`helper helper-asterisk ${this.state.emailValid && "helper-asterisk-red"}`}>
                    *
                  </span>
                </ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Email"
                  value={this.state.profileData.email}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        email: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup controlId="linkedin">
                <ControlLabel>LinkedIn</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="LinkedIn"
                  value={this.state.profileData.linkedin}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        linkedin: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup controlId="github">
                <ControlLabel>GitHub</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="GitHub"
                  value={this.state.profileData.github}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        github: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup controlId="website">
                <ControlLabel>Website</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Website"
                  value={this.state.profileData.website}
                  onChange={e =>
                    this.setState({
                      profileData: {
                        ...this.state.profileData,
                        website: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <Button
                type="submit"
                className="btn grad-btn grad-btn-admin grad-btn-admin-submit"
                disabled={this.props.isLoading === true}
              >
                {this.props.isLoading ? "LOADING..." : "UPDATE"}
              </Button>
            </form>
          </main>
        )}
      </div>
    );
  }
}

export default EditProfile;
