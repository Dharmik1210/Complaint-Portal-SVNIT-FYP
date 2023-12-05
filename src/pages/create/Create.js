import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import Constants from "../../constants/constants";
import Select from "react-select";
import Swal from "sweetalert2";

// styles
import "./Create.css";

const queryCategories = [
  { value: "A", label: "LAN" },
  { value: "B", label: "Peripherals" },
  { value: "C", label: "Systems" },
];

const buildingCategories = [
  { value: "hostel", label: "Hostel" },
  { value: "department", label: "Department" },
  { value: "quarters", label: "Quarters" },
  { value: "other", label: "Other" },
];

const hostelOptions = [
  { value: "swami-bhavan", label: "Swami Bhavan" },
  { value: "bhabha-bhavan", label: "Bhabha Bhavan" },
  { value: "gajjar-bhavan", label: "Gajjar Bhavan" },
  { value: "mother-teresa-bhavan", label: "Mother Teresa Bhavan" },
  { value: "narmad-bhavan", label: "Narmad Bhavan" },
  { value: "nehru-bhavan", label: "Nehru Bhavan" },
  { value: "raman-bhavan", label: "Raman Bhavan" },
  { value: "sarabhai-bhavan", label: "Sarabhai Bhavan" },
  { value: "tagore-bhavan", label: "Tagore Bhavan" },
  { value: "ews-bhavan", label: "EWS hostel" },

  // Add other hostel options here
];

const departmentOptions = [
  { value: "cse", label: "CSE" },
  { value: "ai", label: "AI" },
  { value: "ece", label: "ECE" },
  { value: "ee", label: "EE" },
  { value: "me", label: "ME" },
  { value: "ce", label: "CE" },
  { value: "ch", label: "CH" },
  { value: "chemistry", label: "Chemistry" },
  { value: "mathematics", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "management-studies", label: "Management Studies" },
  { value: "humanities", label: "Humanities" },

  // Add other department options here
];

//styles of react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    cursor: "pointer",

    "&:hover": {
      cursor: "pointer",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
  }),
};

export default function Create() {
  const { user } = useAuthContext();
  const { document: userObj, error } = useDocument("users", user.uid);
  const { document: superAdmin, error: superAdminError } = useDocument(
    "users",
    Constants.SUPER_ADMIN_ID
  );
  const { document: A, error: AError } = useDocument("users", Constants.A_ID);
  const { document: B, error: BError } = useDocument("users", Constants.B_ID);
  const { document: C, error: CError } = useDocument("users", Constants.C_ID);
  const { addDocument, response: addDocResponse } = useFirestore("complaints");
  const { updateDocument, response: updateDocResponse } = useFirestore("users");
  const navigate = useNavigate();

  // form field values
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [building, setBuilding] = useState("");
  const [exactLocation, setExactLocation] = useState("");
  const [image, setImage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [imgError, setImgError] = useState(null);
  const [buildingOptions, setBuildingOptions] = useState("");

  const handleBuildingChange = (option) => {
    setBuilding(option);
    setBuildingOptions(null);
  };

  const handleNestedChange = (option) => {
    setBuildingOptions(option);
  };

  useEffect(() => {
    setFormError(null);
  }, [type, details, building, buildingOptions, image, exactLocation]);

  const handleFileChange = (e) => {
    setImage(null);
    let selected = e.target.files[0];

    if (!selected) {
      setImgError("Please select image");
      return;
    }

    if (!selected.type.includes("image")) {
      setImgError("Please select only image file");
      return;
    }

    if (selected.size > 150000) {
      setImgError("Image file size must be less than 150Kb");
      return;
    }

    setImgError(null);
    setImage(selected);
  };

  const isValid = () => {
    if (!buildingOptions && building.value === "hostel") {
      setFormError("Please select Hostel Name.");
      return false;
    }

    if (!buildingOptions && building.value === "department") {
      setFormError("Please select Department Name.");
      return false;
    }

    if (!type) {
      setFormError("Please select a Complaint type.");
      return false;
    }

    if (!details) {
      setFormError("Please enter details.");
      return false;
    }

    if (!building) {
      setFormError("Please select a building.");
      return false;
    }

    if (imgError) {
      setFormError(imgError);
      return false;
    }

    return true;
  };

  const updateSchema = async (schema, complaint) => {
    const { id, ...updatedSchema } = schema;
    updatedSchema.complaints.push(complaint);
    await updateDocument(id, updatedSchema);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (isValid()) {
      const createdBy = {
        displayName: user.displayName,
        id: user.uid,
      };

      const complaint = {
        type: {
          value: type.value,
          label: type.label,
        },
        details,
        building: buildingOptions ? buildingOptions.value : building.value,
        exactLocation,
        createdBy,
        resolvedBy: {},
        status: "pending",
        comments: [],
      };

      if (!formError && userObj && superAdmin && A && B && C) {
        // addDocument to complaint schema
        const updatedComplaint = await addDocument(complaint, image);

        // update schemas and append new complaint
        updateSchema(userObj, updatedComplaint);
        updateSchema(superAdmin, updatedComplaint);

        if (updatedComplaint.type.value === "A") {
          updateSchema(A, updatedComplaint);
        } else if (updatedComplaint.type.value === "B") {
          updateSchema(B, updatedComplaint);
        } else if (updatedComplaint.type.value === "C") {
          updateSchema(C, updatedComplaint);
        }

        if (!addDocResponse.error && !updateDocResponse.error) {
          Swal.fire(
            "Successfully Created!",
            "The complaint has been created.",
            "success"
          );
          navigate("/");
        } else {
          Swal.fire("Error Occurred", "Please try again.", "error");
        }
      }
    }
  };

  return (
    <div className="create-form">
      <h2>Raise a new Complaint</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Type:</span>
          <Select
            styles={customStyles}
            onChange={(option) => setType(option)}
            options={queryCategories}
          />
        </label>
        <label>
          <span>Building:</span>
          <Select
            styles={customStyles}
            onChange={handleBuildingChange}
            options={buildingCategories}
          />
        </label>
        {building && building.value === "hostel" && (
          <label>
            <span>Select a Hostel:</span>
            <Select
              styles={customStyles}
              onChange={handleNestedChange}
              options={hostelOptions}
            />
          </label>
        )}
        {building && building.value === "department" && (
          <label>
            <span>Select a Department:</span>
            <Select
              styles={customStyles}
              onChange={handleNestedChange}
              options={departmentOptions}
            />
          </label>
        )}
        <label>
          <span>Exact Location:</span>
          <input
            onChange={(e) => setExactLocation(e.target.value)}
            value={exactLocation}
          ></input>
        </label>
        <label>
          <span>Complaint Details:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Add Image:</span>
          <input required type="file" onChange={handleFileChange} />
          {/* {imgError && <div className="error">{imgError}</div>} */}
        </label>

        {!(addDocResponse.isPending || updateDocResponse.isPending) && (
          <button className="btn">Raise Complaint</button>
        )}
        {(addDocResponse.isPending || updateDocResponse.isPending) && (
          <button className="btn" disabled>
            Please Wait
          </button>
        )}
        {formError && <p className="error">{formError}</p>}
        {error && <p className="error">{error}</p>}
        {superAdminError && <p className="error">{superAdminError}</p>}
        {AError && <p className="error">{AError}</p>}
        {BError && <p className="error">{BError}</p>}
        {CError && <p className="error">{CError}</p>}
      </form>
    </div>
  );
}
