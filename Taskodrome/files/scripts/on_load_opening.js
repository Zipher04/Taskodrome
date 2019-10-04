var m_issues_raw;
var m_cooldown_period;
var m_allowed_statuses_map;
var m_status_color_map;
var m_versions;
var m_projectNames;
var m_lang_report_details;
var m_auto_set_status_to_assigned;

function onLoadOpening() {
  var markIndex = window.location.href.lastIndexOf("#");

  if(markIndex != -1) {
    var prevGrid = window.location.href.substr(markIndex + 1, 2);
    openBoard(prevGrid);
  } else {
    openBoard("dg");
  }
};

function isIndexInArray(array, index) {
  return array.length > index && array[index] != null;
};

function isStatusAllowed(id, src_status, dst_status) {
  return isIndexInArray(m_allowed_statuses_map, id)
  && isIndexInArray(m_allowed_statuses_map[id], src_status)
  && m_allowed_statuses_map[id][src_status].indexOf(dst_status) != -1;
};

function getCooldownPeriod() {
  var cooldownPeriodDays = document.getElementById("cooldown_period_days").getAttribute("value");
  var cooldownPeriodHours = document.getElementById("cooldown_period_hours").getAttribute("value");
  console.log("getCooldownPeriod: cooldownPeriodDays - " + cooldownPeriodDays
  + " cooldownPeriodHours - " + cooldownPeriodHours);
  return cooldownPeriodHours * 3600 + cooldownPeriodDays * 86400;
};

function setVersionVisibility() {
  var checkbox_version = document.getElementById("checkbox_version");
  var show_empty_versions = sessionStorage.getItem("show_empty_versions");
  if (show_empty_versions != null) {
    show_empty_versions = (show_empty_versions == "true");
    checkbox_version.checked = show_empty_versions;
  } else {
    show_empty_versions = checkbox_version.checked;
    sessionStorage.setItem("show_empty_versions", show_empty_versions);
  }
  console.log("show_empty_versions - " + show_empty_versions);

  function onCheckboxClick() {
    sessionStorage.setItem("show_empty_versions", checkbox_version.checked);
    fullRedraw();
  };
  checkbox_version.onclick = onCheckboxClick;
};

function setProjectVisibility() {
  var checkbox_group_by_project = document.getElementById("checkbox_group_by_project");
  var group_by_projects = sessionStorage.getItem("group_by_projects");
  if (group_by_projects != null) {
    group_by_projects = (group_by_projects == "true");
    checkbox_group_by_project.checked = group_by_projects;
  } else {
    group_by_projects = checkbox_group_by_project.checked;
    sessionStorage.setItem("group_by_projects", group_by_projects);
  }
  console.log("group_by_projects - " + group_by_projects);

  function onCheckboxClick() {
    sessionStorage.setItem("group_by_projects", checkbox_group_by_project.checked);
    fullRedraw();
  };
  checkbox_group_by_project.onclick = onCheckboxClick;
};

function pageOnLoad() {
  onLoadOpening();

  m_issues_raw = getIssuesRaw();
  m_cooldown_period = getCooldownPeriod();
  m_allowed_statuses_map = getStatusesAllowanceMap();
  m_status_color_map = getStatusColors();
  m_versions = getVersions();
  m_projectNames = getProjectNames();
  m_lang_report_details = getLangReportDetails();
  m_auto_set_status_to_assigned = getAutoSetStatusToAssigned();

  setVersionVisibility();
  setProjectVisibility();
  init();
  statusInit();
  relationshipInit();
};

window.addEventListener("load", pageOnLoad);
