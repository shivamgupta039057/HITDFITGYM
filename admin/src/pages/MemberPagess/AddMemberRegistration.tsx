import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  MenuItem,
  TextField,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import toast from 'react-hot-toast';

interface Plan {
  _id: string;
  planName: string;
  duration: number;
  price: number;
  [key: string]: any;
}

interface ModalProps {
  getFunction: () => void;
  setOpenAddModal: (open: boolean) => void;
  openModal: boolean;
  addPatientsId?: any;
}

interface AddMemberValues {
  fullName: string;
  phone: string;
  age: number | '';
  gender: string;
  address: string;
  planId: string;
  paidFees: number | '';
  weight: number | '';
  goal: string;
}

const initialValues: AddMemberValues = {
  fullName: '',
  phone: '',
  age: '',
  gender: '',
  address: '',
  planId: '',
  paidFees: '',
  weight: '',
  goal: '',
};

const validate = (values: AddMemberValues) => {
  const errors: Record<string, string> = {};
  if (!values.fullName) errors.fullName = 'Required';
  if (!values.phone) {
    errors.phone = 'Required';
  } else if (!/^\d{10}$/.test(values.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }
  if (!values.age) errors.age = 'Required';
  if (!values.gender) errors.gender = 'Required';
  if (!values.address) errors.address = 'Required';
  if (!values.planId) errors.planId = 'Required';
  if (!values.paidFees) errors.paidFees = 'Required';
  if (!values.weight) errors.weight = 'Required';
  if (!values.goal) errors.goal = 'Required';
  return errors;
};

const AddMembersModal: React.FC<ModalProps> = ({
  openModal,
  setOpenAddModal,
  getFunction,
  addPatientsId
}) => {
  const token = localStorage.getItem(localStorageKeys.token);
  const [plans, setPlans] = useState<Plan[]>([]);

  // For edit mode, prepare initialValues from addPatientsId if present.
  const getInitialValues = (): AddMemberValues => {
    if (
      addPatientsId &&
      typeof addPatientsId === 'object' &&
      Object.keys(addPatientsId).length > 0 &&
      addPatientsId._id
    ) {
      return {
        fullName: addPatientsId.fullName || '',
        phone: addPatientsId.phone || '',
        age: addPatientsId.age || '',
        gender: addPatientsId.gender || '',
        address: addPatientsId.address || '',
        planId: addPatientsId.planId && typeof addPatientsId.planId === 'object' ? addPatientsId.planId._id : addPatientsId.planId || '',
        paidFees: addPatientsId.paidFees || '',
        weight: addPatientsId.weight || '',
        goal: addPatientsId.goal || '',
      };
    }
    return initialValues;
  };

  const formInitialValues = useMemo(getInitialValues, [addPatientsId]);

  const getPlans = async () => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }
      let url = `${apiEndPoints.plan.get}`;
      const res = await Apiservice.getAuth(url, token);
      if (res && res.data.status == 200) {
        const newarr = res?.data?.data;
        setPlans(newarr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  // ----------- Add/Edit Mode: API decision logic
  const handleSubmit = async (values: AddMemberValues, { resetForm }: any) => {
    try {
      if (!token) throw new Error('Token is missing.');

      const payload = {
        fullName: values.fullName,
        phone: values.phone,
        age: Number(values.age),
        gender: values.gender,
        address: values.address,
        planId: values.planId,
        paidFees: Number(values.paidFees),
        weight: Number(values.weight),
        goal: values.goal,
      };

      let res;
      if (
        addPatientsId &&
        typeof addPatientsId === 'object' &&
        Object.keys(addPatientsId).length > 0 &&
        addPatientsId._id
      ) {
        // EDIT mode: call edit API
        // const editPayload = { ...payload };
        const editPayload = {
          memberId :  addPatientsId._id,
          ...payload

        }
        res = await Apiservice.postAuth(`${apiEndPoints.member.update}`, editPayload, token);
      } else {
        // ADD mode: call add API
        res = await Apiservice.postAuth(apiEndPoints.member.create, payload, token);
      }

      if (
        (res?.status === 201 || res?.data?.status === 200) &&
        res.data &&
        res.data.message
      ) {
        toast.success(res.data?.message);
        resetForm();
        setOpenAddModal(false);
        getFunction();
      } else if (res?.data?.message) {
        toast.success(res.data?.message);
        setOpenAddModal(false);
        getFunction();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  const dialogTitle = addPatientsId && addPatientsId._id ? 'Edit Member' : 'Add Member';
  const submitButtonLabel = addPatientsId && addPatientsId._id ? 'Update Member' : 'Add Member';

  return (
    <Dialog open={openModal} fullWidth maxWidth="sm">
      <DialogTitle>
        {dialogTitle}
        <IconButton
          onClick={() => {
            setOpenAddModal(false);
          }}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={formInitialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, touched, errors }) => (
            <Form>
              <Grid container spacing={2} sx={{ py: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={values.fullName}
                    onChange={e => setFieldValue('fullName', e.target.value)}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName ? errors.fullName : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={e => setFieldValue('phone', e.target.value)}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone ? errors.phone : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={values.age}
                    onChange={e => setFieldValue('age', e.target.value)}
                    error={touched.age && Boolean(errors.age)}
                    helperText={touched.age && errors.age ? errors.age : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={touched.gender && Boolean(errors.gender)}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={values.gender}
                      label="Gender"
                      onChange={e => setFieldValue('gender', e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select gender</em>
                      </MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.gender && errors.gender ? errors.gender : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={touched.planId && Boolean(errors.planId)}
                  >
                    <InputLabel id="plan-label">Plan</InputLabel>
                    <Select
                      labelId="plan-label"
                      id="planId"
                      name="planId"
                      value={values.planId}
                      label="Plan"
                      onChange={e => setFieldValue('planId', e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select plan</em>
                      </MenuItem>
                      {Array.isArray(plans) && plans.length > 0 && plans.map(plan => (
                        <MenuItem key={plan._id} value={plan._id}>
                          {plan.planName} - {plan.duration} {plan.duration > 1 ? "months" : "month"} - ₹{plan.price}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched.planId && errors.planId ? errors.planId : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Paid Fees"
                    name="paidFees"
                    type="number"
                    value={values.paidFees}
                    onChange={e => setFieldValue('paidFees', e.target.value)}
                    error={touched.paidFees && Boolean(errors.paidFees)}
                    helperText={touched.paidFees && errors.paidFees ? errors.paidFees : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Weight"
                    name="weight"
                    type="number"
                    value={values.weight}
                    onChange={e => setFieldValue('weight', e.target.value)}
                    error={touched.weight && Boolean(errors.weight)}
                    helperText={touched.weight && errors.weight ? errors.weight : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={values.address}
                    onChange={e => setFieldValue('address', e.target.value)}
                    multiline
                    minRows={2}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address ? errors.address : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Goal"
                    name="goal"
                    value={values.goal}
                    onChange={e => setFieldValue('goal', e.target.value)}
                    multiline
                    minRows={2}
                    error={touched.goal && Boolean(errors.goal)}
                    helperText={touched.goal && errors.goal ? errors.goal : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogActions>
                    <Button
                      onClick={() => setOpenAddModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {submitButtonLabel}
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
