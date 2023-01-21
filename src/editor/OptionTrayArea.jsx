import { Add } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";


function OptionTrayArea() {
	return (
		<Grid className="bg-gray" sx={{mt: 1, p:"4px"}}container justifyContent={"space-between"} alignItems="center">
			<Grid item>
				<Typography variant="body2">Options</Typography>
			</Grid>
			<Grid item>
				<IconButton size="small" sx={{
                    backgroundColor: "#565856",
                    color: "white",
                    "&:hover":{
                        backgroundColor: "#364037"
                    }
                }}><Add/></IconButton>
			</Grid>
		</Grid>
	);
}

export default OptionTrayArea;
