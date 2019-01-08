import {
  connect
} from "react-redux";
import EditProfile from "./EditProfile";
import {
  fetchProfileEdit
} from "./EditProfileActions";

function mapStateToProps({
  isLoading,
  hasError,
  isLoginInvalid,
  validationState
}) {
  return {
    isLoading,
    hasError,
    isLoginInvalid,
    validationState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    editProfile: (graduateId) => dispatch(fetchProfileEdit(graduateId))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);