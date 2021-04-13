import React, { Component}  from 'react';
import {FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { Multiselect } from "multiselect-react-dropdown";
import './match.css';
import './styles.css';


class match extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plainArray: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
            objectArray: [
              { key: "Option 1", cat: "Group 1" },
              { key: "Option 2", cat: "Group 1" },
              { key: "Option 3", cat: "Group 1" },
              { key: "Option 4", cat: "Group 2" },
              { key: "Option 5", cat: "Group 2" },
              { key: "Option 6", cat: "Group 2" },
              { key: "Option 7", cat: "Group 2" }
            ],
            selectedValues: [
              { key: "Option 1", cat: "Group 1" },
              { key: "Option 2", cat: "Group 1" }
            ]
          };
          this.style = {
            chips: {
              background: "red"
            },
            searchBox: {
              border: "none",
              "border-bottom": "1px solid blue",
              "border-radius": "0px"
            },
            multiselectContainer: {
              color: "red"
            }
          };
          this.addItem = this.addItem.bind(this);
        }
        addItem() {
          this.selectedValues.push({ key: "Option 3", cat: "Group 1" });
        }
      

        render() {
            const { plainArray, objectArray, selectedValues } = this.state;
                return (
                    <div>
                        <div className="container" >
                            <input type="text" placeholder="Search..."/>
                    <div className="examples col-12 col-md-5">
                            <Multiselect
                                options={objectArray}
                                displayValue="key"
                                groupBy="cat"
                                showCheckbox={true}
                            />
                            
                        </div>
                        <code className="displayBlock mt10">
                            &lt;Multiselect
                            <br />
                            &nbsp;&nbsp;options=&#123;objectArray}
                            <br />
                            &nbsp;&nbsp;groupBy="cat"
                            <br />
                            &nbsp;&nbsp;displayValue="key"
                            <br />
                            &nbsp;&nbsp;showCheckbox=&#123;true}
                            <br />
                            />
                        </code>


                        <button class="like__btn">
                            <span id="icon"><FaRegThumbsUp/></span>
                            <span> </span>
                            Like 
                        </button>
                        <button class="dislike__btn">
                            <span id="icon"><FaRegThumbsDown/></span>
                            <span> </span>
                            Dislike
                        </button>
                    </div>

                    </div>
            
        );
    }
}

export default match;
