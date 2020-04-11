# final-project-sharks
Milestone 4: Status Update

- The project in its current iteration is live at: https://au-cs-infovis-spring20.github.io/final-project-sharks/
- Images of Current Interface: ![](capture.png)
- Modifications to Proposed Implementation: 
  - We have made several changes based on the recommendations we received during the midterm presentation. In order to increase the complexity of the project and provide more meaningful interaction, the user will be able to select tracks dragging a bounding box over a section of the map. 
  - The user will also be able to filter all tracks on the map by limiting the dates shown. The same functionality of filtering by species and animating a sharks path will still be implemented. Depending on the feasibility of animating multiple tracks at once, this may also be implemented. 
  - We are primarily using Mapbox GL JS and will likely utilize Turf in order to remove points that fall on land. We initially planned to use d3 in some way, but have not needed it thus far.
- Milestones and Schedule:
    - Our initial schedule:
        -   3/20: Preprocess the data, display map with bathysphere data
            3/27: Getting shark nodes on there with links
            3/27: Class Milestone 4, Status Update
            4/10: Refine visual of the links/nodes, filters
            4/17: Animation, UI
            4/17-4/20: Troubleshooting/Final Revisions
            4/21: Class Milestone 5, Final Product & Presentation
    - We are relatively on schedule currently. We have the bathysphere data, nodes, and some degree of filtering in place.
    - We do still need to add in links and get the filtering working better than it is currently.
