import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  division: "",
  district: "",
  constituency: "",
  divisions: [],
  districts: [],
  constituencies: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setDivision: (state, action) => {
      state.division = action.payload;
      // Clear dependent fields when division changes
      state.district = "";
      state.constituency = "";
      state.districts = [];
      state.constituencies = [];
    },
    setDistrict: (state, action) => {
      state.district = action.payload;
      // Clear dependent fields when district changes
      state.constituency = "";
      state.constituencies = [];
    },
    setConstituency: (state, action) => {
      state.constituency = action.payload;
    },
    setDivisions: (state, action) => {
      state.divisions = action.payload;
    },
    setDistricts: (state, action) => {
      state.districts = action.payload;
    },
    setConstituencies: (state, action) => {
      state.constituencies = action.payload;
    },
    resetFilters: (state) => {
      state.division = "";
      state.district = "";
      state.constituency = "";
      state.districts = [];
      state.constituencies = [];
    },
  },
});

export const {
  setDivision,
  setDistrict,
  setConstituency,
  setDivisions,
  setDistricts,
  setConstituencies,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
