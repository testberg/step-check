import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Checkbox,
  FormControlLabel,
  makeStyles,
} from "@material-ui/core";
import { useState, useEffect, useCallback } from "react";
import DoneIcon from "@material-ui/icons/Done";
import clsx from "clsx";
import axios from "axios";
import useLocalStorage from "../hooks/useLocalStorage";
import { default as initialSteps } from "../seed";

const useIconStyles = makeStyles({
  root: {
    backgroundColor: "black",
    zIndex: 1,
    width: 25,
    height: 25,
    color: "#fff",
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});

function StepIcon(props) {
  const classes = useIconStyles();
  const { active, completed, icon } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icon}
    </div>
  );
}

export default function VerticalLinearStepper() {
  const { setLocalSteps, getLocalSteps } = useLocalStorage();
  const localSteps = null;
  /**
   * check if there is a localStorage value
   * else set initialSteps to localStorage value and steps useState hook
   */
  if (process.browser) {
    localSteps = getLocalSteps("steps");
    if (!localSteps) {
      setLocalSteps(initialSteps);
    }
  }

  const [steps, setSteps] = useState(getLocalSteps());
  const [activeStep, setActiveStep] = useState(0);
  const [randomFact, setRandomFact] = useState(null);

  const getActive = useCallback(() => {
    /**
     * returns the index of first step with a task 'not done'
     */
    const active = steps?.findIndex((step) =>
      step.tasks.find((t) => t.done === false)
    );
    return active;
  }, [steps]);

  const handleChange = (task, label) => {
    /**
     * sets steps/tasks values with checkbox state
     */

    let stepIndex = steps.findIndex((item) => item.label === label);
    const currentStep = steps[stepIndex];
    const newTasks = currentStep.tasks.map((aTask) =>
      aTask.label === task.label ? { ...task, done: !task.done } : aTask
    );

    const newSteps = steps.map((aStep) =>
      aStep.label === currentStep.label
        ? { ...currentStep, tasks: newTasks }
        : aStep
    );

    setSteps(newSteps);
  };

  const handleReset = () => {
    /**
     * sets first steps as active
     */
    setActiveStep(0);
    setSteps(initialSteps);
  };

  useEffect(() => {
    const currentActive = getActive();
    setActiveStep(currentActive);
    setLocalSteps(steps);
  }, [steps, getActive, setLocalSteps]);

  useEffect(() => {
    const loadFact = async () => {
      try {
        const { data } = await axios.get(
          "https://uselessfacts.jsph.pl/random.json?language=en"
        );
        setRandomFact(data.text);
      } catch (e) {
        setRandomFact("Failed to load a fact, still a fact!");
      }
    };

    if (activeStep === -1) {
      loadFact();
    } else setRandomFact(null);
  }, [activeStep]);
  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical" connector={null}>
        {steps?.map((step, index) => {
          return (
            <Step key={step.label}>
              <StepLabel StepIconComponent={StepIcon}>
                <Box
                  fontWeight="bold"
                  lineHeight={2}
                  m={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {step.label}
                  {(activeStep === -1 || activeStep > index) && <DoneIcon />}
                </Box>
              </StepLabel>
              {step.tasks.map((task, key) => {
                return (
                  <FormControlLabel
                    key={key}
                    label={<Box fontSize={14}>{task.label}</Box>}
                    control={
                      <Checkbox
                        checked={task.done}
                        onChange={(e) => {
                          handleChange(task, step.label);
                        }}
                      />
                    }
                  />
                );
              })}
            </Step>
          );
        })}
      </Stepper>
      <Paper key={"info"} square elevation={0}>
        {randomFact && <Typography mb={1}>{randomFact}</Typography>}
        <Button onClick={handleReset} sx={{ mt: 2 }}>
          Reset
        </Button>
      </Paper>
    </>
  );
}
