import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(value, purpose) {
        return {
          payload: {
            value,
            purpose,
          },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.value;
        state.balance += action.payload.value;
        state.loanPurpose = action.payload.purpose;
      },
    },
    payLoan(state) {
      if (state.loan > state.balance) return;

      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };
  return async (dispatch, getState) => {
    try {
      dispatch({ type: "account/convertingCurrency" });
      //API CALL
      const host = "api.frankfurter.app";
      const res = await fetch(
        `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
      );

      const data = await res.json();
      const converted = data.rates.USD;

      //dispatch action
      dispatch({ type: "account/deposit", payload: converted });
    } catch (error) {
      console.error(error.message);
    }
  };
}
export default accountSlice.reducer;
// ? Old Reducer
// export default function accountReducer(state = initialState, action) {
//   switch (action.type) {
//     case "account/deposit":
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     case "account/withdraw":
//       if (action.payload > state.balance) return state;
//       return { ...state, balance: state.balance - action.payload };
//     case "account/requestLoan":
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         loan: action.payload.value,
//         loanPurpose: action.payload.purpose,
//         balance: state.balance + action.payload.value,
//       };
//     case "account/payLoan":
//       if (state.loan > state.balance) return state;
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: "",
//         balance: state.balance - state.loan,
//       };
//     case "account/convertingCurrency":
//       return { ...state, isLoading: true };
//     default:
//       return state;
//   }
// }

// export function deposit(amount, currency) {
//   if (currency === "USD") return { type: "account/deposit", payload: amount };
//   return async (dispatch, getState) => {
//     try {
//       dispatch({ type: "account/convertingCurrency" });
//       //API CALL
//       const host = "api.frankfurter.app";
//       const res = await fetch(
//         `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
//       );

//       const data = await res.json();
//       const converted = data.rates.USD;

//       //dispatch action
//       dispatch({ type: "account/deposit", payload: converted });
//     } catch (error) {
//       console.error(error.message);
//     }
//   };
// }

// export function withdraw(amount) {
//   return { type: "account/withdraw", payload: amount };
// }

// export function requestLoan(amount, purpose = "unknown") {
//   return {
//     type: "account/requestLoan",
//     payload: { value: amount, purpose },
//   };
// }

// export function payLoan() {
//   return { type: "account/payLoan" };
// }
