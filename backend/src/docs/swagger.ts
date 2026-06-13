import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Resume Analyzer & CV Reviewer API",
      version: "1.0.0",
      description: "API documentation for the AI Resume Analyzer & CV Reviewer application. Access the UI at `/api-docs`.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email"],
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"], default: "user" },
            phoneNumber: { type: "string" },
            avatarUrl: { type: "string" },
            subscriptionId: { type: "string" },
            resumeIds: { type: "array", items: { type: "string" } },
            linkedInUrl: { type: "string" },
            githubUrl: { type: "string" },
            careerLevel: { type: "string", enum: ["student", "junior", "mid", "senior"] },
            preferredJobTitles: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Resume: {
          type: "object",
          required: ["title", "fileUrl", "fileType"],
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            title: { type: "string" },
            fileUrl: { type: "string" },
            fileType: { type: "string", enum: ["pdf", "docx"] },
            extractedText: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            education: { type: "array", items: { type: "string" } },
            experience: { type: "array", items: { type: "string" } },
            projects: { type: "array", items: { type: "string" } },
            certifications: { type: "array", items: { type: "string" } },
            languages: { type: "array", items: { type: "string" } },
            totalExperienceYears: { type: "number" },
            aiScore: { type: "number" },
            atsScore: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        ResumeAnalysis: {
          type: "object",
          properties: {
            _id: { type: "string" },
            resumeId: { type: "string" },
            userId: { type: "string" },
            overallScore: { type: "number" },
            atsCompatibility: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            weaknesses: { type: "array", items: { type: "string" } },
            missingSkills: { type: "array", items: { type: "string" } },
            keywordSuggestions: { type: "array", items: { type: "string" } },
            grammarIssues: { type: "array", items: { type: "string" } },
            formattingIssues: { type: "array", items: { type: "string" } },
            recommendedRoles: { type: "array", items: { type: "string" } },
            improvementTips: { type: "array", items: { type: "string" } },
            analyzedAt: { type: "string", format: "date-time" }
          }
        },
        CoverLetter: {
          type: "object",
          required: ["userId", "resumeId", "jobMatchId"],
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            resumeId: { type: "string" },
            jobMatchId: { type: "string" },
            companyName: { type: "string" },
            jobTitle: { type: "string" },
            content: { type: "string" },
            tone: { type: "string", enum: ["professional", "formal", "creative"] },
            generatedByAI: { type: "boolean", default: true },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        InterviewSession: {
          type: "object",
          required: ["userId", "resumeId"],
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            resumeId: { type: "string" },
            jobTitle: { type: "string" },
            companyName: { type: "string" },
            questions: { type: "array", items: { type: "string" } },
            answers: { type: "array", items: { type: "string" } },
            feedback: { type: "array", items: { type: "string" } },
            score: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            weaknesses: { type: "array", items: { type: "string" } },
            sessionType: { type: "string", enum: ["technical", "hr"] },
            videoUrl: { type: "string" },
            audioUrl: { type: "string" },
            confidenceScore: { type: "number" },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        JobMatch: {
          type: "object",
          required: ["userId", "resumeId"],
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            resumeId: { type: "string" },
            jobTitle: { type: "string" },
            companyName: { type: "string" },
            jobDescription: { type: "string" },
            matchScore: { type: "number" },
            matchedSkills: { type: "array", items: { type: "string" } },
            missingSkills: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            coverLetterId: { type: "string" },
            salaryRange: { type: "string" },
            location: { type: "string" },
            remote: { type: "boolean" },
            industry: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        Subscription: {
          type: "object",
          required: ["userId"],
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            plan: { type: "string", enum: ["free", "pro", "premium"], default: "free" },
            price: { type: "number" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            features: { type: "array", items: { type: "string" } },
            paymentStatus: { type: "string", enum: ["pending", "paid", "failed"] },
            stripeCustomerId: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        AdminLog: {
          type: "object",
          required: ["adminId", "action"],
          properties: {
            _id: { type: "string" },
            adminId: { type: "string" },
            action: { type: "string" },
            targetUserId: { type: "string" },
            details: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          }
        }
      }
    },
    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "name"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                    name: { type: "string" },
                    phoneNumber: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: { description: "Email already registered" }
          }
        }
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Log in a user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Logged in successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: "Invalid email or password" }
          }
        }
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Log out the current user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Logged out successfully" },
            401: { description: "Unauthorized" }
          }
        }
      },
      "/auth/refresh-token": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          responses: {
            200: {
              description: "Token refreshed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          token: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: "Refresh token not found or invalid" }
          }
        }
      },
      "/resume": {
        post: {
          tags: ["Resume"],
          summary: "Upload a new resume",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: { type: "string", format: "binary" },
                    title: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Resume created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: { $ref: "#/components/schemas/Resume" }
                    }
                  }
                }
              }
            }
          }
        },
        get: {
          tags: ["Resume"],
          summary: "Get all resumes (paginated)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
          ],
          responses: {
            200: {
              description: "Resumes retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          items: { type: "array", items: { $ref: "#/components/schemas/Resume" } },
                          total: { type: "integer" },
                          pages: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resume/{resumeId}": {
        get: {
          tags: ["Resume"],
          summary: "Get a single resume by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "resumeId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Resume retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: { $ref: "#/components/schemas/Resume" }
                    }
                  }
                }
              }
            },
            404: { description: "Resume not found" }
          }
        },
        put: {
          tags: ["Resume"],
          summary: "Update resume details or file",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "resumeId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    file: { type: "string", format: "binary" },
                    title: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Resume updated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: { $ref: "#/components/schemas/Resume" }
                    }
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ["Resume"],
          summary: "Delete a resume",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "resumeId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Resume deleted" }
          }
        }
      },
      "/resume/{resumeId}/analyze": {
        post: {
          tags: ["Resume"],
          summary: "Trigger AI analysis on a resume",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "resumeId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Analysis completed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/ResumeAnalysis" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resume/{resumeId}/analysis": {
        get: {
          tags: ["Resume"],
          summary: "Get AI analysis results for a resume",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "resumeId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Analysis details retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/ResumeAnalysis" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/ai/analyze": {
        post: {
          tags: ["AI"],
          summary: "Analyze resume with AI constraints",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId"],
                  properties: { resumeId: { type: "string" } }
                }
              }
            }
          },
          responses: {
            200: { description: "AI Analysis retrieved" }
          }
        }
      },
      "/ai/ats-optimize": {
        post: {
          tags: ["AI"],
          summary: "Optimize resume for ATS using job description",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId", "jobDescription"],
                  properties: {
                    resumeId: { type: "string" },
                    jobDescription: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Optimized content generated" }
          }
        }
      },
      "/ai/suggestions": {
        post: {
          tags: ["AI"],
          summary: "Suggest improvements for resume sections",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId"],
                  properties: {
                    resumeId: { type: "string" },
                    section: { type: "string", example: "experience" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Suggestions retrieved" }
          }
        }
      },
      "/ai/job-matches": {
        post: {
          tags: ["AI"],
          summary: "Match resume against list of job descriptions",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId", "jobDescriptions"],
                  properties: {
                    resumeId: { type: "string" },
                    jobDescriptions: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Job matches ranked" }
          }
        }
      },
      "/cover-letter": {
        post: {
          tags: ["Cover Letter"],
          summary: "Generate and save a cover letter",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId", "jobTitle", "companyName", "jobDescription"],
                  properties: {
                    resumeId: { type: "string" },
                    jobTitle: { type: "string" },
                    companyName: { type: "string" },
                    jobDescription: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Cover letter generated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/CoverLetter" }
                    }
                  }
                }
              }
            }
          }
        },
        get: {
          tags: ["Cover Letter"],
          summary: "Get user's cover letters",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
          ],
          responses: {
            200: { description: "Cover letters list retrieved" }
          }
        }
      },
      "/cover-letter/{coverLetterId}": {
        get: {
          tags: ["Cover Letter"],
          summary: "Get cover letter details",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "coverLetterId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Cover letter details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/CoverLetter" }
                    }
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ["Cover Letter"],
          summary: "Update cover letter content",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "coverLetterId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    content: { type: "string" },
                    jobTitle: { type: "string" },
                    companyName: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Cover letter updated" }
          }
        },
        delete: {
          tags: ["Cover Letter"],
          summary: "Delete a cover letter",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "coverLetterId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Cover letter deleted" }
          }
        }
      },
      "/cover-letter/{coverLetterId}/download": {
        get: {
          tags: ["Cover Letter"],
          summary: "Download cover letter as PDF file",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "coverLetterId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "PDF file downloaded successfully",
              content: {
                "application/pdf": {
                  schema: { type: "string", format: "binary" }
                }
              }
            }
          }
        }
      },
      "/interview/start": {
        post: {
          tags: ["Interview"],
          summary: "Start a mock interview session",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["resumeId", "jobTitle", "companyName", "sessionType"],
                  properties: {
                    resumeId: { type: "string" },
                    jobTitle: { type: "string" },
                    companyName: { type: "string" },
                    sessionType: { type: "string", enum: ["technical", "hr"] }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Interview session created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/InterviewSession" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/interview": {
        get: {
          tags: ["Interview"],
          summary: "Get interview sessions list",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
          ],
          responses: {
            200: { description: "Interview sessions list retrieved" }
          }
        }
      },
      "/interview/{sessionId}": {
        get: {
          tags: ["Interview"],
          summary: "Get single interview session details",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "sessionId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Interview session details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/InterviewSession" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/interview/{sessionId}/submit": {
        post: {
          tags: ["Interview"],
          summary: "Submit answer for a question",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "sessionId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["answer"],
                  properties: { answer: { type: "string" } }
                }
              }
            }
          },
          responses: {
            200: { description: "Answer submitted" }
          }
        }
      },
      "/interview/{sessionId}/end": {
        post: {
          tags: ["Interview"],
          summary: "End mock interview session",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "sessionId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Interview session ended" }
          }
        }
      },
      "/interview/{sessionId}/feedback": {
        get: {
          tags: ["Interview"],
          summary: "Get feedback for mock interview session",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "sessionId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Feedback retrieved" }
          }
        }
      },
      "/user/profile": {
        get: {
          tags: ["User"],
          summary: "Get authenticated user profile",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "User profile details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      data: { $ref: "#/components/schemas/User" }
                    }
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ["User"],
          summary: "Update authenticated user profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    phoneNumber: { type: "string" },
                    linkedInUrl: { type: "string" },
                    githubUrl: { type: "string" },
                    careerLevel: { type: "string", enum: ["student", "junior", "mid", "senior"] },
                    preferredJobTitles: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Profile updated" }
          }
        }
      },
      "/user/avatar": {
        post: {
          tags: ["User"],
          summary: "Upload profile avatar",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["avatar"],
                  properties: {
                    avatar: { type: "string", format: "binary" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Avatar uploaded successfully" }
          }
        }
      },
      "/user/change-password": {
        post: {
          tags: ["User"],
          summary: "Change user password",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["currentPassword", "newPassword"],
                  properties: {
                    currentPassword: { type: "string" },
                    newPassword: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Password changed successfully" }
          }
        }
      },
      "/user/account": {
        delete: {
          tags: ["User"],
          summary: "Delete user account",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Account deleted successfully" }
          }
        }
      },
      "/admin/dashboard": {
        get: {
          tags: ["Admin"],
          summary: "Get admin dashboard statistics",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Admin dashboard stats retrieved" }
          }
        }
      },
      "/admin/users/manage": {
        post: {
          tags: ["Admin"],
          summary: "Manage system users",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["action"],
                  properties: {
                    action: { type: "string", enum: ["list", "deactivate", "activate", "updateRole"] },
                    userId: { type: "string" },
                    status: { type: "string" },
                    role: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "User management operation completed" }
          }
        }
      },
      "/admin/logs": {
        get: {
          tags: ["Admin"],
          summary: "Get admin activity logs",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Logs list retrieved" }
          }
        }
      },
      "/admin/settings": {
        put: {
          tags: ["Admin"],
          summary: "Update system settings",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["setting", "value"],
                  properties: {
                    setting: { type: "string" },
                    value: { type: "object" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "System setting updated" }
          }
        }
      },
      "/admin/stats": {
        get: {
          tags: ["Admin"],
          summary: "Get system analytics details",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "System stats details" }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};